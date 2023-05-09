-include ../../version
#####################################################################################
dist_dir=$(CURDIR)/deploy
service=tts-gui
#####################################################################################
########### DOCKER ##################################################################
tag=airenas/$(service):$(version)

dbuild: 
	cd ../.. && docker buildx build -t $(tag) --build-arg BUILD_VERSION=$(version) -f ./build/docker/Dockerfile ./
dpush: dbuild
	docker push $(tag)
dscan: dbuild	
	docker scan --accept-license $(tag)
########### END #####################################################################
clean:
	cd $(main_dir) && $(MAKE) clean
	rm -rf $(dist_dir)

.PHONY:
	clean dbuild dpush build 
