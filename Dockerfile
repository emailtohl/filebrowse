FROM golang
ENV TZ=Asia/Shanghai
ENV GOPROXY=http://goproxy.x
COPY . /opt/filebrowse
VOLUME /files
RUN go build
EXPOSE 8086
CMD [ "filebrowse", "/files" ]