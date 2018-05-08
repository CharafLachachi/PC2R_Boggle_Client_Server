FROM ocaml/ocaml

RUN mkdir /server

WORKDIR /server

ADD . /server

RUN ocamlc -o server -thread -custom unix.cma threads.cma -cclib -lthreads -cclib -lunix str.cma server.ml

EXPOSE 2018/tcp

ENTRYPOINT [ "./server" ]