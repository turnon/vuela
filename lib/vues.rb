require 'vues/version'
require 'vues/mapping'
require 'vues/search'
require 'rest-client'

module Vues
  class Model
    attr_reader :mapping

    def initialize(host: ENV['VUES_HOST'], index: ENV['VUES_INDEX'])
      @host, @index = host, index
      @mapping = Mapping.new(host, index)
    end

    def first_statistic
      search = Search.new(mapping.fields)
      search.first_time
    end
  end
end
