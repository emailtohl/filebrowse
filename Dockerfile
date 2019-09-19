FROM golang
LABEL author=emailtohl@163.com
ENV TZ=Asia/Shanghai
ENV GOPROXY=http://goproxy.x
WORKDIR /proj
COPY . /proj
COPY ./resources/ /data
VOLUME /data
RUN go build
EXPOSE 8086
CMD [ "./filebrowse", "/data" ]