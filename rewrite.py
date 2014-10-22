#!/usr/bin/env python
# -*- coding: utf-8 -*-

import createmiddle
import verify

import sys
import re

class Rewrite(object):
	
	config =  createmiddle.Config('config.json')
	properties = createmiddle.Properties()
	ver = verify.Verify()
	file_type = 'jsp'
	def __init__(self):
		if self.ver.is_verify == True:
			self.write_all()

	def find_key(self,value_match):
		dic = self.ver.res_dict
		file_type = self.file_type
		target_str = self.config['target'][file_type]
		if file_type == 'js':
			dic = self.ver.locale_dict
		value = value_match.group()
		result = None

		for key in dic:
			if dic[key] == value or '\''+dic[key]+'\'' == value or '"'+dic[key]+'"' == value:
				result = key
				if file_type == 'js':
					result = target_str.replace('$',key.lower())
				else :
					result = target_str.replace('$',key.upper())
				return result
		return result

	def replace_cn(self,all_text):
		regex = r"[\x80-\xff]+"
		file_type = self.file_type
		if file_type != 'jsp':
			regex = r'\'[\x80-\xff]+\'|\"[\x80-\xff]+\"'
		result_text = re.sub(regex,self.find_key,all_text,0)

		return result_text

	def write_all(self):
		self.write_properties()
		self.write_res()
		self.write_locale()
		self.write_jsp()
		self.write_js()
		self.write_java()

	def write_jsp(self):
		self.file_type = 'jsp'
		jsp_list = self.config['src']['jsp']
		for i in range(len(jsp_list)):
			file_obj = open(jsp_list[i],'r+')
			file_result = open('output\\'+jsp_list[i].split('\\')[-1],'w')
			try:
				jsp_text = file_obj.read()
				result_text = self.replace_cn(jsp_text)
				#file_obj.seek(0)
				file_result.write(result_text)
			finally:
				file_obj.close()
				file_result.close()
				print jsp_list[i] + u'更改成功'


	def write_js(self):
		self.file_type = 'js'
		js_list = self.config['src']['js']
		for i in range(len(js_list)):
			file_obj = open(js_list[i],'r+')
			file_result = open('output\\'+js_list[i].split('\\')[-1],'w')
			try:
				js_text = file_obj.read()
				result_text = self.replace_cn(js_text)
				#file_obj.seek(0)
				file_result.write(result_text)
			finally:
				file_obj.close()
				file_result.close()
				print js_list[i] + u'更改成功'

	def write_java(self):
		self.file_type = 'java'
		java_list = self.config['src']['java']
		for i in range(len(java_list)):
			file_obj = open(java_list[i],'r+')
			file_result = open('output\\'+java_list[i].split('\\')[-1],'w')
			try:
				java_text = file_obj.read()
				result_text = self.replace_cn(java_text)
				#file_obj.seek(0)
				file_result.write(result_text)
			finally:
				file_obj.close()
				file_result.close()
				print java_list[i] + u'更改成功' 

	def write_properties(self):
		new_dict = self.ver.new_dict
		self.properties.append_dict(new_dict)

	def write_res(self):
		new_keys = self.ver.res_dict.keys()
		res_file = 'resConst.java'
		file_obj = open('output\\'+res_file,'w')
		try:
			for key in new_keys:
				file_obj.write('String ' + key.upper()+'='+'"'+key+'";'+'\n')  
		finally:
			file_obj.close()
			print u"java和jsp脚本成功输出到resConst.java"

	def write_locale(self):
		new_keys = self.ver.locale_dict.keys()
		locale_file = 'locale.js'
		file_obj = open('output\\'+locale_file,'w')
		try:
			for key in new_keys:
				file_obj.write(key+':'+'$.i18n.prop('+'\''+key+'\''+'),\n' )
		finally:
			file_obj.close()
			print u"js脚本成功输出到locale.js"
if __name__ == '__main__':
	reload(sys)
	sys.setdefaultencoding('utf-8')
	rewrite = Rewrite()

