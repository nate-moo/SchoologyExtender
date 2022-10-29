version := 0.8.1

all-w: chrome-w firefox-w
all-l: chrome-l firefox-l

chrome-w:
	powershell Compress-Archive -Path src/* -DestinationPath target/SchoologyExtender-$(version).chromium.zip

chrome-l:
	zip target/SchoologyExtender-$(version).chromium.zip src/*

firefox-w:
	echo finish
	powershell Compress-Archive -Path src/* -DestinationPath target/SchoologyExtender-$(version).firefox.zip

firefox-l:
	echo finish
	zip target/SchoologyExtender-$(version).firefox.zip src/*