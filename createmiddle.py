#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import re
import sys

class Config(object):
	config_data = {}
	def __init__(self,config_path):
		self.__dict__ = self.config_data	
		self.get_config(config_path)

	def get_config(self,config_path):
		file_obj = open(config_path)
		try:
			self.config_data = json.load(file_obj)
		finally:
			file_obj.close()

	def __get__(self,obj,klas):
		return self.config_data

class Properties(object):
	config = Config('config.json')
	prop_dict = {}
	def get_dict(self):
		prop_file = self.config['properties']
		file_obj = open(prop_file)
		try:
			for line in file_obj:
				line = line.strip()
				if line:
					if line[0] == '#':
						continue
					else:
						key_value_list = line.split('=')
						self.prop_dict[key_value_list[0]] = key_value_list[1]
		finally:
			file_obj.close()
		return self.prop_dict

	def append_dict(self,new_dict):
		prop_file = self.config['properties']
		output = open('output\\'+prop_file.split('\\')[-1],'w')
		try:
			output.write('\n')
			for key in new_dict:
				output.write(key + "=" + new_dict[key].encode('unicode-escape') + "\n")
		finally:
			output.close()
			print prop_file + u"插入成功"

class Process(object):
	config = Config('config.json')
	def find_cn(self,regex,text,name,file_path):
		lis = []
		res = re.findall(regex,text)
		if res:
			for i in res:
				lis.append((file_path,i))
		return lis

	#read jsp file get Chinese string
	def get_jsps(self):
		jsp_list = self.config['src']['jsp']
		jsp_cn_list = []
		for i in range(len(jsp_list)):
			jsp_file = jsp_list[i]
			file_obj = open(jsp_file)
			try:
				all_text = file_obj.read()
				jsp_cn_list = jsp_cn_list + self.find_cn(r"[\x80-\xff]+",all_text,"non-ascii",jsp_file)
			finally:
				file_obj.close()
		return jsp_cn_list

	#read js file get Chinese string
	def get_jses(self):
		js_list = self.config['src']['js']
		js_cn_list = []
		for i in range(len(js_list)):
			js_file = js_list[i]
			file_obj = open(js_file)
			try:
				all_text = file_obj.read()
				js_cn_list = js_cn_list + self.find_cn(r"[\x80-\xff]+",all_text,"non_ascii",js_file)
			finally:
				file_obj.close()
		return js_cn_list

	#read java file get Chinese string 
	def get_javas(self):
		java_list = self.config['src']['java']
		java_cn_list = []
		for i in range(len(java_list)):
			java_file = java_list[i]
			file_obj = open(java_file)
			try:
				all_text = file_obj.read()
				java_cn_list = java_cn_list + self.find_cn(r"[\x80-\xff]+",all_text,"non-ascii",java_file)
			finally:
				file_obj.close()
		return java_cn_list

	#merge Chinese string differ from one another output one field only
	def merge_string(self,jsp_list,java_list=[]):
		all_cn_list = jsp_list + java_list
		size = len(all_cn_list)
		result_cn_list = [all_cn_list[0]]
		for i in range(1,size):
			the_str = all_cn_list[i][1]
			for j in range(len(result_cn_list)):
				if the_str == result_cn_list[j][1]:
					break
				if j == len(result_cn_list)-1 and the_str != result_cn_list[j]:
					result_cn_list.append(all_cn_list[i])
		return result_cn_list

	#get same Chinese string and output string and source file in neighbour line
	def sort_string(self):
		all_str_list = self.get_jses() + self.get_jsps()
		return all_str_list

	#write middle file
	def write_middle_const(self,merged_list,js_list):
		output = open(self.config['output']['res'],'w')
		for i in range(len(merged_list)):
			print merged_list
			output.write(merged_list[i][0] + " " + merged_list[i][1] + "\n")
		output.close()
		output = open(self.config['output']['locale'],'w')
		try:
			for i in range(len(js_list)):
				print js_list
				output.write(js_list[i][0] + " " + js_list[i][1]+ "\n")
		finally:
			output.close()

def main():
	reload(sys)
	sys.setdefaultencoding('utf-8')
	print sys.getdefaultencoding()

	process = Process()
	
	jsp_list = process.get_jsps()

	java_list = process.get_javas()

	js_list = process.get_jses()

	merged_list = process.merge_string(jsp_list,java_list)
	js_list = process.merge_string(js_list)

	process.write_middle_const(merged_list,js_list)

	properties = Properties()

if __name__ == '__main__':
	main()
