module Vues
  class Mapping
    attr_reader :index, :fields

    def initialize(host, index)
      @index = index
      url = File.join(host, @index, '_mapping')
      resp = RestClient.get(url)
      @fields = parse_fields(resp.body)
    end

    def parse_fields(json)
      fields = []

      JSON.parse(json)[index]['mappings']['_doc']['properties'].each_pair do |name, type|
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
              size: 1000
            }
          }
        }
      end
    end

  end
end
