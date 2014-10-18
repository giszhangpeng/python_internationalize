#!/usr/bin/env python
# -*- coding: utf-8 -*-

import createmiddle

class Verify(object):
	
	config =  createmiddle.Config('config.json')
	properties = createmiddle.Properties()
	new_dict = {}
	locale_dict = {}
	res_dict = {}
	def __init__(self):
		self.is_verify = True
		self.verify_middle()

	def verify_middle(self):
		locale_file = self.config['output']['locale']
		res_file = self.config['output']['res']
		src_keys = self.properties.get_dict().keys()

		locale_obj = open(locale_file)
		try:
			for line in locale_obj:
				line = line.strip()
				if line:
					key_value_list = line.split(' ')
					self.locale_dict[key_value_list[0].strip()] = key_value_list[1].strip()
		finally:
			locale_obj.close()

		res_obj = open(res_file)
		try:
			for line in res_obj:
				line = line.strip()
				if line:
					key_value_list = line.split(' ')
					self.res_dict[key_value_list[0].strip()] = key_value_list[1].strip()
		finally:
			res_obj.close()
		
		locale_keys = self.locale_dict.keys()
		res_keys = self.res_dict.keys()
		target_keys = locale_keys + res_keys
		for key in locale_keys:
			if key in res_keys:
				print 'locale.txt has the same key with res.txt, key name: ' + key
				self.is_verify = False
		for key in target_keys:
			if key in src_keys:
				print 'locale.txtb or res.txt has the same key with source properties file, key name: ' + key
				self.is_verify = False
		if self.is_verify == True:
			self.new_dict = dict(self.locale_dict.items() + self.res_dict.items())
			print 'verify sucess'
			print 'now system will append key=value properties into source file and replace source Chinese string with set name in jsp,js,java file'
	
if __name__ == '__main__':
	verify = Verify()
	print verify.is_verify
	print verify.new_dict
