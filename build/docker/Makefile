-include ../Makefile.options
#####################################################################################
dist_dir=$(CURDIR)/deploy
main_dir=../../
source_dir=../../deploy/html
service=tts-gui
version=0.2
commit_count=$(shell git rev-list --count HEAD)
#####################################################################################
$(dist_dir):
	mkdir -p $@
$(dist_dir)/html:
	mkdir -p $@

$(dist_dir)/.build: | $(dist_dir)/html
	cd $(main_dir) && $(MAKE) build
	cp -r $(source_dir)/* $(dist_dir)/html
	cp index.html $(dist_dir)/html/
	touch $(dist_dir)/.build

build: $(dist_dir)/.build
########### DOCKER ##################################################################
tag=airenas/$(service):$(version).$(commit_count)

dbuild: build
	docker build -t $(tag) --build-arg BUILD_VERSION=$(version).$(commit_count) ./

dpush: dbuild
	docker push $(tag)
########### END #####################################################################
clean:
	cd $(main_dir) && $(MAKE) clean
	rm -rf $(dist_dir)

.PHONY:
	clean dbuild dpush build 
