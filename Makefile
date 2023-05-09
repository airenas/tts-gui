-include Makefile.options
-include version
#####################################################################################
dist_dir=$(CURDIR)/deploy
port?=8000
main_dir=synthesis-web
#####################################################################################
init: 
	cd $(main_dir) && npm ci
test/unit: 
	cd $(main_dir) && ng test
test/lint: 
	cd $(main_dir) && npm run lint
#####################################################################################
$(dist_dir):
	mkdir -p $(dist_dir)

updateVersion: | $(dist_dir)
	cat $(main_dir)/src/environments/environment.prod.sample \
		| sed 's/BUILD_VERSION/$(version)/g' > $(dist_dir)/environment.prod.ts
	rsync --checksum $(dist_dir)/environment.prod.ts $(main_dir)/src/environments/environment.prod.ts	

$(dist_dir)/.build: $(main_dir) $(main_dir)/src $(main_dir)/src/environments/environment.prod.ts
	cd $(main_dir) && ng build --prod --output-path=$(dist_dir)/html --base-href / --output-hashing none
	touch $(dist_dir)/.build

build: updateVersion $(dist_dir)/.build
#####################################################################################
serve-deployed:
	docker run -p $(port):80 -v $(dist_dir)/html:/usr/share/nginx/html nginx:1.17.9
#####################################################################################
files=main-es5.js main-es2015.js polyfills-es5.js polyfills-es2015.js runtime-es5.js runtime-es2015.js \
	3rdpartylicenses.txt styles.css info
tts_files=$(patsubst %, $(dist_dir)/tts/%, $(files))
$(dist_dir)/tts/%: $(dist_dir)/html/% | $(dist_dir)/tts
	cp $< $@
$(dist_dir)/tts/info: $(dist_dir)/tts | $(dist_dir)/tts
	echo version : $(version) > $@
	echo date    : $(shell date --rfc-3339=seconds) >> $@

pack: 
	$(MAKE) clean build && $(MAKE) tts-component-$(version).tar.gz
$(dist_dir)/tts:
	mkdir -p $@
tts-component-$(version).tar.gz: $(tts_files) $(dist_dir)/.build | $(dist_dir)/tts	
	tar -czf $@ -C $(dist_dir) tts
#####################################################################################
dbuild:
	cd build/docker && $(MAKE) dbuild
dpush:
	cd build/docker && $(MAKE) dpush
dscan:
	cd build/docker && $(MAKE) dscan			
#####################################################################################
put-component:
	scp tts-component-$(version).tar.gz $(component-share)

clean:
	rm -rf $(dist_dir)

.PHONY:
	clean build updateVersion
