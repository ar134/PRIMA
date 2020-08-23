# PRIMA Abgabe

[Gamedesigndokument](https://github.com/ar134/PRIMA/blob/master/TowerDefenseGame/gamedesigndocument.md)<br />
[Code](https://github.com/ar134/PRIMA/tree/master/TowerDefenseGame)<br />
[Archiv](https://github.com/ar134/PRIMA/blob/master/TowerDefenseGame/PRIMA_Artur_Zich_Abgabe.zip)<br />
[Game](https://rawcdn.githack.com/ar134/PRIMA/e9920d0262dfc8867d640d02c99d9b2db9140649/TowerDefenseGame/Main.html)


Der Spieler kann nicht gewinnen und Sinn ist es so lange durchzuhalten wie möglich. Dabei muss der Spieler Ressourcen sammeln (der gelbe Punkt auf der Map ist der Resource Point) und seine Basis aufbauen. Zusätzlich kann er neue Gebäude freischalten.

## Checkliste für Leistungsnachweis
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 |TowerDefenseGame
|    | Name                  |Artur Zich
|    | Matrikelnummer        |257298
|  1 | Nutzerinteraktion     | Der Nuter kann rechts auf das Baumenü klicken und somit damit interagieren. Nachdem er erfolgreich ein Gebäude gebaut hat, kann er dieses auf die Karte platzieren, indem er auf ein freies Feld draufklickt. Will er ein Gebäude auf der Karte platzieren, sieht er, ob dieses Gebäude auf dem Feld gebaut werden kann. Zusätzlich sieht er bei manchen Gebäuden, wie einem Turm, die Angriffsreichweite.                                                                                                  |
|  2 | Objektinteraktion     | Türme greifen Feinde an, falls diese in ihre Schussreichweite geraten. Einige Türme haben spezielle Effekte auf den Feind. Der Acid Tower verlangsamt die Feinde und der Gravity Tower platziert die Feinde zurück auf den Anfang des Pfades. Einige Objekte können nur gebaut werden, falls andere Objekte sich auf dem Spielfeld befinden.                                                                                                                                                                           |
|  3 | Objektanzahl variabel | Die Anzahl der Feinde erhöht sich im Laufe der Spielzeit. Zusätzlich erscheinen auch immer stärkere Feinde, wobei es maximal vier unterschiedliche Typen gibt.                                                                                                                                          |
|  4 | Szenenhierarchie      | Die erste Node ist "towerDefenseGame". Darauf stehen die Nodes "gameField" und "allEnemies". GameField enthält jedes Feld im Spiel. AllEnemies alle feindlichen Objekte. Wird ein Gebäude gebaut, wird es zum Child des Feldes auf dem es gebaut wurde.                                                                                              |
|  5 | Sound                 | Sound wurde absichtlich nicht eingesetzt, da ich sowas bei einem Minispiel als störend empfunden habe.                                                      |
|  6 | GUI                   | Das Spiel fängt sofort mit einer zufälligen Karte an und falls der Spieler verliert, erscheint ein Menu mit der Möglichkeit das Spiel nochmals zu spielen. Ingame gibt es rechts ein Baumenu, welches dem Spieler unterschiedliche Informationen gibt, falls er mit der Maus darüberhovert.                                 |
|  7 | Externe Daten         | Die Bilder für das Baumenu sind im Ordner "img" gespeichert.                                                              |
|  8 | Verhaltensklassen     | Das Verhalten der Objekte Feinde, Gebäude und Bullets werden in ihrer eigenen Klasse definiert. Gesteuert werden die Objekte Feinde und Gebäude im Main.ts.
| 10 | Maße & Positionen     | Alle Objekte fangen mit den Standardmaßen an. Feinde spawnen immer am Anfang des Pfades und ihre Maße symbolisieren ihre Lebenspunkte und Geschwindigkeit. Größere Feinde haben mehr Lebenspunkte und sind langsamer als kleinere Feinde. Der Pfad wird zufällig erstellt und am Ende des Pfades ist die Basis positioniert. Unterhalb der Karte befindet sich immer ein Resourcepunkt, welcher ebenfalls zufällig positioniert wird.                                                     |
| 11 | Event-System | Es wird während des Spiels immer überprüft, ob die Maus sich bewegt hat, auf welchem Feld diese sich gerade befindet und ob darauf geklickt wurde. Zusätzlich wird überprüft, ob der Nutzer bestimmte Tasten gedrückt hat. Diese Tasten sollen das Bauen der Gebäude erleichtern. Die Information welche Tasten, welche Gebäude bauen steht im Tooltip der Gebäude im Baumenu.                                                                                                                                                             |