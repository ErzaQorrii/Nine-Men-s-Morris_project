# Nine-Men-s-Morris_project
Punuar nga:
Erza Qorri, Maltine Rama, Alketa Bala, Jeta Syla, Arbresha Stublla, Yllka Nishevci, Puhiza Tmava, Leonita Bahtiri, Lironë Bytyçi, Yll Pajaziti,Sumeja Veseli
 
Loja Nine Man's Morris ka disa rregulla:
1. Nine Men's Morris luhet nga 2 lojtarë.
2. Çdo lojtar merr 9 pjesë.
3. Lojtarët me radhë vendosin çdo pjesë në tabelë. Pjesët vendosen në rrathë ose
pika ku kryqëzohen vijat.
4. Pasi të gjitha pjesët të jenë në tabelë, lojtarët i lëvizin me radhë pjesët nga
hapësira në hapësirë, duke u përpjekur për të marrë një vijë me tre (ose
horizontale, vertikale ose diagonale, ose për të bllokuar kundërshtarin nga marrja
e një rreshti prej tre).
5. Sa herë që një lojtar bën një rresht me 3, hiqet një pjesë e kundërshtarit nga
tabela.
6. Pasi një lojtar është me dy pjesë (nuk mund të bëjë më një rresht me tre) ai lojtar
humbet dhe loja mbaroi.

Kjo lojë është realizuar përmes algoritmit minimax, i cili është një mënyrë e zakonshme për të vlerësuar gjendjet e lojës në
lojëra si shahu, checkers, Nine Men's Morris, etj. Algoritmi ka një kompleksitet kohor prej O(bm), ku b është faktori i degëzimit të pemës së lojës dhe m është dept maksimal.
Algoritmi minimax është një algoritëm rekurziv i përdorur në teorinë e lojës dhe inteligjencën artificiale për të llogaritur lëvizjen optimale për një lojtar në një lojë me dy lojtarë, zero-sum lojë.
Ai përfshin kërkimin përmes një peme nyjesh, ku një nyje është një tabelë dhe pjesë e mundshme e lojës. Algoritmi quhet minimax. Algoritmi supozon
se të dy lojtarët do të bëjnë gjithmonë lëvizjen më të mirë për veten e tyre.


(Variabla Search Depth) Ndryshimi i thellësisë së kërkimit mund të zvogëlojë llogaritjen e nevojshme, si dhe të lejojë që algoritmi të shikojë më tej në pemë. Duke lejuar që thellësia e kërkimit të rregullohet në mënyrë dinamike bazuar në gjendjen aktuale të lojës, mund të zgjidhet thellësia optimale, duke lejuar kërkimin më efikas dhe të saktë.

Projekti mund të ekzekutohet gjithashtu në URL-në e mëposhtme: https://a4e42d3b.nine-men-s-morris-project.pages.dev/