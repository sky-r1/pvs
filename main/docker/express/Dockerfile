FROM nikolaik/python-nodejs:python3.10-nodejs16

RUN apt-get update -y \
    && apt-get upgrade -y \
		&& apt-get dist-upgrade -y \
		&& apt-get autoremove -y \
    && apt-get autoclean -y

RUN apt-get install -y python3-pip


# install python library
COPY ./docker/express/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt 
# && \
#    rm -rf ~/.cache/pip


WORKDIR /usr/src/app
EXPOSE 5000