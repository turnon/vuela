require 'rack'
require 'thin'
require 'rest-client'
require 'pry'

VUES_HOST = 'http://192.168.0.107:9200'
VUES_INDEX = 'jvbs'

class Vues
  def call(env)
    mapping = Mapping.new
    s = Search.new(mapping.fields)
    [ 200, { "Content-Type" => "text/json" }, [s.first_time.to_json] ]
  end

  class Mapping
    attr_reader :fields

    def initialize
      url = File.join(VUES_HOST, VUES_INDEX, '_mapping')
      resp = RestClient.get(url)
      @fields = parse_fields(resp.body)
    end

    def parse_fields(json)
      fields = []

      JSON.parse(json)[VUES_INDEX]['mappings']['_doc']['properties'].each_pair do |name, type|
        if type['type'] == 'keyword'
          fields << Keyword.new(name)
        end
      end

      fields
    end
  end

  class Field
    attr_reader :name

    def initialize(name)
      @name = name
    end

    def query
      raise NotImplementedError.new
    end

    def agg
      raise NotImplementedError.new
    end
  end

  class Keyword < Field
    def query
      {terms: {name => []}}
    end

    def agg
      {
        name => {
          terms: {
            field: name,
            size: 1000
          }
        }
      }
    end
  end

  class Search
    def initialize(fields)
      @query = Query.new(fields)
      @aggs = Aggs.new(fields)
    end

    def first_time
      @aggs.generate
    end

    def generate
      @query.generate.merge(@aggs.generate)
    end
  end

  class Query
    def initialize(fields)
      @queries = fields.map(&:query)
    end

    def generate
      {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  must: @queries,
                  must_not: @queries
                }
              }
            ]
          }
        }
      }
    end
  end

  class Aggs
    def initialize(fields)
      aggs = {
        aggs: fields.reduce({}){ |agg, f| agg.merge(f.agg) }
      }
      @aggs = Marshal.dump(aggs)
    end

    def generate
      Marshal.load(@aggs)
    end
  end
end

Rack::Handler::Thin.run(Vues.new, Port: 3000, Host: '192.168.0.107')
