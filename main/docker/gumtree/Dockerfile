FROM gumtreediff/gumtree

RUN apt-get update -y \
    && apt-get upgrade -y \
	&& apt-get dist-upgrade -y \
	&& apt-get autoremove -y \
    && apt-get autoclean -y \
    && apt-get install -y curl \
    && curl --silent --location https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

WORKDIR /usr/src/app
ENTRYPOINT ["/bin/bash"]
EXPOSE 4567