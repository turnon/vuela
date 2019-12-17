module Vues
  class Search

    attr_reader :client

    def initialize(client, index)
      @client = client
      @query = Query.new(index.fields)
      @aggs = Aggs.new(index.fields)
    end

    def first_time
      client.search(body: @aggs.generate)
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
