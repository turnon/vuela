require 'rest-client'
require 'pry'

class Vues
  HTML = File.join(__dir__, 'index.html')

  class Req < Rack::Request
    def index
      path.sub(/\//, '')
    end

    def url_mapping
      File.join(host + ':9200', index, '_mapping')
    end

    def mapping
      @redirect_to_mapping ||= JSON.parse(RestClient.get(url_mapping).body)
    end

    def keywords
      return @keywords if @keywords
      @keywords = []

      properties.each_pair do |field, type|
        @keywords << field if type['type'] == 'keyword'
      end

      @keywords
    end

    def properties
      @properties ||= mapping[index]['mappings']['_doc']['properties']
    end
  end

  def call(env)
    req = Req.new(env)

    case
    when req.params.empty?
      [200, {'Contenit-Type' => 'text/json'}, [req.keywords.to_json]]
    else
      f = File.open(HTML, File::RDONLY)
      [200, {'Content-Type' => 'text/html'}, f]
    end
  end
end

run Vues.new
