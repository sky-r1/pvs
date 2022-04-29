# import sys
# import urllib.request
import requests
import xml.etree.ElementTree as ET 

url = 'http://gumtree:4567/api/'

# with urllib.request.urlopen(url) as response:
#   xml = response.read().decode('utf-8')

with requests.get(url) as response:
  xml = response.text

with open('sample.xml', mode='w') as f:
    f.write(xml)

# print(xml)

tree = ET.parse('sample.xml')
m = 0
i = 0

def dump_node(node, indent=0):
  global m
  global i
  # print("{}{} {}".format('    ' * indent, node.tag, node.attrib))
  if ('pos' in node.attrib) and ('other_pos' in node.attrib) :
    m = m + 1
  elif ('pos' in node.attrib) and ('other_pos' not in node.attrib) :
    i = i + 1
  for child in node:
      dump_node(child, indent + 1)

dump_node(tree.getroot())

print(f'm:{m}, i:{i}')