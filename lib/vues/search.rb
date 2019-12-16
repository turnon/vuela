module Vues
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
