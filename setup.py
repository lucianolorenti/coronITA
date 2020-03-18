#!/usr/bin/env python

from distutils.core import setup

setup(name='Coronita',
      version='1.2',
      description='Coronavirus Italy',
      author='Luciano Lorenti',
      install_requires=[
          'pandas',
          'numpy',
          'flask',
	  'gunicorn',
	  'scipy'
      ],
      author_email='lucianolorenti@gmail.com',      
      packages=['coronita'],
     )
