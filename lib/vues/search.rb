module Vues
  class Search

    attr_reader :url

    def initialize(index)
      @url = File.join(index.url, '_search')

      resp = RestClient.get(url)
      @query = Query.new(index.fields)
      @aggs = Aggs.new(index.fields)
    end

    def first_time
      resp = RestClient::Request.execute(
        method: :get, url: url,
        payload: @aggs.generate.to_json, headers: {'Content-Type' => 'application/json'}
      )

      resp.body
    end

    def generate
      @query.generate.merge(@aggs.generate)
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
end
