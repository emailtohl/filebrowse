## package
```bash
docker run -d -p 8086:8086 --name filebrowse -v /opt/files:/data -it filebrowse
```

```bash
docker exec -it filebrowse /bin/bash
```

```bash
cp -r resources/* /data/  
exit
```