require 'vues/version'
require 'vues/index'
require 'vues/search'
require 'rest-client'

module Vues
  class Model
    attr_reader :index

    def initialize(host: ENV['VUES_HOST'], index: ENV['VUES_INDEX'])
      @index = Index.new(host, index)
    end

    def first_statistic
      search = Search.new(index)
      search.first_time
    end
  end
end
