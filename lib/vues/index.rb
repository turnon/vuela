module Vues
  class Index
    attr_reader :url, :name, :fields

    def initialize(host, index_name)
      @name = index_name
      @url = File.join(host, index_name)

      resp = RestClient.get(File.join(url, '_mapping'))
      @fields = parse_fields(resp.body)
    end

    def parse_fields(json)
      fields = []

      JSON.parse(json)[name]['mappings']['_doc']['properties'].each_pair do |name, type|
        if type['type'] == 'keyword'
          fields << Keyword.new(name)
        end
      end

      fields
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
              size: 10
            }
          }
        }
      end
    end

  end
end
