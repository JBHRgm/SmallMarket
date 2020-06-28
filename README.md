# SmallMarket

In develop-Branch wurde die komplette Applikation entwickelt. Nachdem die App fertig gestellt worden ist, wurde das Ergebnis in den Master-Branch gemerged.

Die Entwicklung lief mit einem lokalen MySQL-Server und dem Node-Command-Prompt um den Express-Server zu starten. Erst als die App fertig war, wurde das ganze zusammen mit einem Redis-Server in Docker-Container verpackt und auf diesen Branch gepusht. Ich hatte das Problem, dass ich immer ein "docker-compose down", dann "docker-compose build" und letztendlich "docker-compose up" ausführen musste, damit der Container die Änderungen übernimmt. Da dies nicht gerade förderlich für eine Entwicklungsumgebung ist, hatte ich mich dafür entschieden ohne Docker (und ohne Redis) zu entwickeln. Das Ergebnis dieser Entwicklung findet sich im Master-Branch.

Also: Dieser Branch enthält die Docker Version der Appliaktion.
