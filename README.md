python_internationalize
=======================

substitute Chinese characters in project into English

须知：

1、首先需要了解工程国际化的过程，本系统有三部分需要国际化，jsp，java，js

2、脚本采用中电海康52所标准进行国际化

3、原始java和js中的中文字符串必须是和其他字符串分开，独立存在的，比如支持 "中文" ,'中文',  aa + '中文' +,这种格式，
不支持  "other_character中文other_character",以及  "('中文')"格式，必须转为 "other_character"+"中文"+"other_character" 和 "('"+"中文"+"')"格式


配置过程：

1、首先配置config.json，配置需要国际化的文件路径，配置产生中间文件的路径，配置properties文件路径，
并且该文件时以UTF-8格式编码，并且中文内容是ASCII格式编码的，配置中文字符串转换的格式，其中$是需要被替换为properties中文字符对应的英文

2、运行createmiddle.py 产生中间文件，中间文件为config.json中配置的output中的locale 和 res，locale包括js字符串，res包括java和jsp字符串

3、打开中间文件(默认为locale.txt 和 res.txt),内容包括需要转换的文件和中文字符串名称，将每一行文件名替换为你想定义的英文资源，比如 
accelerate.js 时间格式不能为空  -> hcms_timenotnull 时间格式不能为空

4、运行rewrite.py文件，运行该文件时会对你在中间文件定义的资源英文名进行验证，如果和原有的properties资源文件命名冲突，会提示哪个文件名冲突，并返回
这时，你需要重新对变量进行命名。如果没有错误，会自动在properties文件中插入新的资源，生成java代码（res.java）和js代码（locale.js）
你需要将这些代码拷贝到工程的相应位置，脚本会替换原始jsp，java和js文件中的中文字符串按照config.json target里定义的格式和你定义的命名替换为新的名称

软件缺陷：

1、输出的中间文件中包括的中文名是经过合并的，其中locale.txt 包括所有js的中文，res.txt包括jsp和java中的中文，按照config.json中的src文件顺序进行取值

2、需要配置python找得到的文件路径，建议将该脚本放在工程同级目录，使用相对路径查找，绝对路径是肯定可行的
