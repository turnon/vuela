require 'elasticsearch'

module Vues

  class Client
    Lock = Mutex.new
    Pool = Hash.new

    attr_reader :client, :index

    class << self
      def get(host, index)
        client = Lock.synchronize do
          Pool[host] ||= Elasticsearch::Client.new url: host, log: true
        end
        new(client, index)
      end
    end

    def initialize(client, index)
      @index = index
      @client = client
    end

    def get_mapping
      client.indices.get_mapping(index: index)
    end

    def search(args = {})
      client.search(args.merge(index: index))
    end
  end

end
