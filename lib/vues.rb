require 'vues/version'
require 'vues/client'
require 'vues/index'
require 'vues/search'

module Vues
  class Model
    attr_reader :index, :client

    def initialize(host: ENV['VUES_HOST'], index: ENV['VUES_INDEX'])
      @client = Client.get(host, index)
      @index = Index.new(client, index)
    end

    def first_statistic
      search = Search.new(client, index)
      search.first_time
    end
  end
end
