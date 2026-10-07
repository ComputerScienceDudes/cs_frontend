# Ruby removed these no-op taint methods in 3.2, but GitHub Pages' Liquid uses them.
require 'bundler/setup'
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?; false; end
    def taint; self; end
    def untaint; self; end
  end
end
ARGV.replace(['serve', '--host', '127.0.0.1', '--port', '4500'] + ARGV)
load Gem.bin_path('jekyll', 'jekyll')
