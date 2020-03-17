#!/usr/bin/env python

from distutils.core import setup

setup(name='Coronita',
      version='1.1',
      description='Coronavirus Italy',
      author='Luciano Lorenti',
      install_requires=[
          'pandas',
          'numpy',
          'flask',
	  'gunicorn'
      ],
      author_email='lucianolorenti@gmail.com',      
      packages=['coronita'],
     )
