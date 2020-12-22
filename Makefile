-include ../Makefile.options
#####################################################################################
dist_dir=$(CURDIR)/deploy
port?=8000
main_dir=synthesis-web
commit_count=$(shell git rev-list --count HEAD)
SYNTHESIS_WEB_COMPONENT_VERSION?=0.1
version=$(SYNTHESIS_WEB_COMPONENT_VERSION)
#####################################################################################
$(dist_dir):
	mkdir -p $(dist_dir)

updateVersion: | $(dist_dir)
	cat $(main_dir)/src/environments/environment.prod.sample \
		| sed 's/BUILD_VERSION/$(version).$(commit_count)/g' > $(dist_dir)/environment.prod.ts
	rsync --checksum $(dist_dir)/environment.prod.ts $(main_dir)/src/environments/environment.prod.ts	

$(dist_dir)/.build: $(main_dir) $(main_dir)/src $(main_dir)/src/environments/environment.prod.ts
	cd $(main_dir) && ng build --prod --output-path=$(dist_dir)/html --base-href / --output-hashing none
	touch $(dist_dir)/.build

build: updateVersion $(dist_dir)/.build
#####################################################################################
serve-prod:
	docker run -p $(port):80 -v $(dist_dir)/html:/usr/share/nginx/html nginx:1.17.9

clean:
	rm -rf $(dist_dir)

.PHONY:
	clean build updateVersion
