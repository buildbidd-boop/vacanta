// TOATE datele aplicației. Editează aici — nu în app.js.
//
// Câmpul `time` e ora de ceas (ex. "09:00"). Când nu avem o oră confirmată,
// e null și randarea lasă gol locul orei — nu se inventează ore (regula din brief).
// Câmpurile lat/lng lipsă (null) sunt TODO — nu au coordonate publice de încredere.
// Restul coordonatelor (Istanbul, Thassos, Keramoti) sunt din surse publice,
// marcate "// de verificat" — confirmă-le pe hartă înainte de plecare.
// Câmpurile `story` (Istanbul/Thassos) sunt texte scrise ca material editorial,
// nu date de verificat — corectează liber tonul sau faptele dacă nu sunt pe gustul tău.

const TRIP_STORY = {
  intro: "În fiecare an drumul e o poveste nouă. Anul acesta pornim cu mașina spre două lumi diferite: Istanbul, unde Europa se ciocnește de Asia peste apa Bosforului, și Thassos, insula verde a Egeei de Nord, unde marmura albă se termină direct în mare.",
  turkey: "Turcia e locul unde muezinul se aude peste acoperișuri de tablă, unde ceaiul se bea din pahar subțire de sticlă și unde fiecare colț din Sultanahmet ține o bucată din peste 1600 de ani de istorie — bizantină, apoi otomană, apoi turcă.",
  greece: "Grecia, la Thassos, e cealaltă viteză: plaje cu nisip de marmură, sate de pescari, tăvi de mâncare care țin trei ore pe masă. Insula a fost cândva sursă de aur și marmură pentru toată Antichitatea — azi e sursă de liniște."
};

const TRIP_DAYS = [
  {
    id: 1,
    date: "22.08",
    weekday: "Sâmbătă",
    zone: "drum",
    zoneLabel: "Drum",
    title: "București → Istanbul",
    stops: [
      {
        order: 1,
        time: "01:00",
        title: "Plecare — București, Berceni",
        detail: "Start traseu.",
        lat: 44.359699982039075,
        lng: 26.15083627478914
      },
      {
        order: 2,
        time: "02:12", // calculat: 01:00 + 1h12min
        title: "Oprire — alimentare",
        detail: "73 km · 1h12min de la plecare. Pauză ~20 min (plecare estimată 02:32).",
        lat: 43.83143432762293,
        lng: 25.975398351229284
      },
      {
        order: 3,
        time: "05:53", // calculat: 02:32 (după pauză) + 3h21min
        title: "A doua oprire",
        detail: "232 km · 3h21min de la oprirea anterioară. Pauză ~20 min (plecare estimată 06:13).",
        lat: 42.49121673663703,
        lng: 26.557673744140338
      },
      {
        order: 4,
        time: "08:54", // calculat: 06:13 (după pauză) + 2h41min — NU include vama
        title: "A treia oprire — alimentare",
        detail: "210 km · 2h41min de la oprirea anterioară. Include trecerea vămii BG → TR (durată variabilă, neinclusă în oră — poate ajungi mai târziu). Pauză ~20 min (plecare estimată 09:14).",
        lat: 41.29728704393528,
        lng: 27.75518349869076
      },
      {
        order: 5,
        time: "10:38", // calculat: 09:14 (după pauză) + 1h24min
        title: "Sosire Istanbul — 9 Doors Hotel, Sultanahmet",
        detail: "123 km · 1h24min de la oprirea anterioară. Parcarea NU e inclusă (10–15 €/zi).",
        lat: 41.00349466022244,
        lng: 28.982058250892283
      }
    ]
  },
  {
    id: 2,
    date: "23.08",
    weekday: "Duminică",
    zone: "istanbul",
    zoneLabel: "Istanbul",
    title: "Sultanahmet (tot pe jos)",
    stops: [
      {
        order: 1,
        time: null,
        title: "Moscheea Albastră (Sultanahmet Camii)",
        detail: "9 min pe jos de la cazare. (E aceeași clădire — nu se dublează cu 'Sultanahmet Camii'.)",
        story: "Șase minarete și peste 20.000 de plăci de faianță İznik albastru-turcoaz — de-aici vine numele neoficial al moscheii. Construită la începutul secolului XVII, ca răspuns otoman la măreția Sfintei Sofia din apropiere.",
        lat: 41.0054,
        lng: 28.9768 // de verificat
      },
      {
        order: 2,
        time: null,
        title: "Topkapı Muzeu",
        detail: "10 min pe jos de la cazare.",
        story: "Reședința sultanilor otomani timp de aproape 400 de ani. În curțile lui s-au decis războaie, s-au păstrat comori și s-a administrat un imperiu întins pe trei continente.",
        lat: 41.0115,
        lng: 28.9833 // de verificat
      },
      {
        order: 3,
        time: null,
        title: "Basilica Cistern",
        detail: "12 min pe jos de la cazare.",
        story: "O pădure subterană de 336 de coloane, construită de bizantini în secolul VI ca rezervor de apă al orașului. Două capete de Meduza, așezate întoarse sau într-o parte, țin locul într-un mister nerezolvat.",
        lat: 41.0084,
        lng: 28.9779 // de verificat
      },
      {
        order: 4,
        time: null,
        title: "Gulhane Park",
        detail: "21 min pe jos de la cazare / 12 min de la moschee.",
        story: "Cândva grădina exterioară a palatului Topkapı, azi cel mai vechi parc public al orașului — loc de respiro la umbra teilor bătrâni și a zidurilor sultanilor.",
        lat: 41.0130,
        lng: 28.9810 // de verificat
      },
      {
        order: 5,
        time: null,
        title: "Grand Bazaar",
        detail: "22 min pe jos de la cazare.",
        story: "Peste 4.000 de magazine sub un acoperiș din secolul XV, pe unde au trecut mătăsuri, mirodenii și negustori de pe tot Drumul Mătăsii — unul din primele mall-uri acoperite ale lumii.",
        lat: 41.0106,
        lng: 28.9681 // de verificat
      },
      {
        order: 6,
        time: null,
        title: "Eminönü",
        detail: "33 min pe jos de la cazare / 5 min de la Grand Bazaar. Pește; se intră subteran spre bazar.",
        story: "Malul unde Cornul de Aur se varsă în Bosfor — vad de pescari, vânzători de balık ekmek și feriboturi care pleacă spre partea asiatică a orașului la fiecare câteva minute.",
        lat: 41.0170,
        lng: 28.9709 // de verificat
      }
    ]
  },
  {
    id: 3,
    date: "24.08",
    weekday: "Luni",
    zone: "istanbul",
    zoneLabel: "Istanbul",
    title: "Galata & Beyoğlu",
    stops: [
      {
        order: 1,
        time: null,
        title: "Galata Tower",
        detail: "31 min cu transport public de la cazare.",
        story: "Turn genovez din secolul XIV, construit când Galata era o colonie comercială italiană, independentă de restul orașului. De sus se vede toată cotitura Cornului de Aur.",
        lat: 41.0256,
        lng: 28.9744 // de verificat
      },
      {
        order: 2,
        time: null,
        title: "Kamondo Stairs",
        detail: "3 min pe jos de la Galata Tower.",
        story: "Scări Art Nouveau construite de familia Kamondo, bancheri evrei-otomani, ca dar pentru cartier — azi unul din cele mai fotografiate colțuri din Galata.",
        lat: 41.0247,
        lng: 28.9738 // de verificat
      },
      {
        order: 3,
        time: null,
        title: "Karaköy",
        detail: "9 min pe jos de la Galata Tower.",
        story: "Vechiul cartier al bancherilor genovezi, azi plin de cafenele de specialitate și ateliere — contrast direct cu turnul medieval de deasupra lui.",
        lat: 41.0246,
        lng: 28.9762 // de verificat
      },
      {
        order: 4,
        time: null,
        title: "Galata Port",
        detail: "15 min pe jos de la Karaköy.",
        story: "Fostul doc industrial de pe malul Bosforului, transformat recent într-o promenadă cu vedere spre partea veche a orașului.",
        lat: 41.0272,
        lng: 28.9750 // de verificat
      },
      {
        order: 5,
        time: null,
        title: "Taksim Square",
        detail: "22 min pe jos de la Galata Port. Stradă cu magazine, trenuleț roșu.",
        story: "Inima Istanbulului modern — piața unde se termină marile bulevarde și de unde pornește strada İstiklal, cu tramvaiul ei roșu nostalgic.",
        lat: 41.0370,
        lng: 28.9850 // de verificat
      },
      {
        order: 6,
        time: null,
        title: "Dolmabahçe Palace",
        detail: "20 min pe jos de la Taksim. 200 lei intrarea; curtea e gratuită.",
        story: "Palatul care a înlocuit Topkapı ca reședință sultanală în secolul XIX — baroc european pe dinafară, otoman pe dinăuntru, cu un candelabru de cristal de 4,5 tone.",
        lat: 41.0392,
        lng: 28.9990 // de verificat
      },
      {
        order: 7,
        time: null,
        title: "Ortaköy",
        detail: "34 min cu transport public de la Dolmabahçe.",
        story: "Cartier de pe malul Bosforului, cunoscut pentru moscheea lui neo-barocă, lipită de apă chiar sub Podul Bosfor.",
        lat: 41.0473,
        lng: 29.0270 // de verificat
      }
    ]
  },
  {
    id: 4,
    date: "25.08",
    weekday: "Marți",
    zone: "istanbul",
    zoneLabel: "Istanbul",
    title: "Balat + Bosfor",
    stops: [
      {
        order: 1,
        time: null,
        title: "Balat",
        detail: "40 min cu transport public de la cazare. Case și scări colorate, pentru poze.",
        story: "Vechiul cartier evreiesc și grecesc al orașului — case colorate, scări înguste, biserici, sinagogi și moschei una lângă alta, martore ale unui Istanbul cosmopolit de altădată.",
        lat: 41.0290,
        lng: 28.9490 // de verificat
      },
      {
        order: 2,
        time: null,
        title: "Plimbare pe Bosfor",
        detail: "Activitate — fără un punct fix; TODO dacă vrei un loc anume de plecare.",
        story: "Strâmtoarea care desparte (și leagă) Europa de Asia — pe malurile ei stau palate otomane, cetăți bizantine și cartiere de pescari, la câțiva metri de apă.",
        lat: null,
        lng: null
      },
      {
        order: 3,
        time: null,
        title: "Cină pe vapor (restaurant-feribot)",
        detail: "Activitate — cină cu priveliște pe apă. TODO: numele restaurantului/locul de îmbarcare.",
        story: "O cină cu tot orașul luminat pe ambele maluri — cel mai simplu mod de a vedea dintr-o dată Europa și Asia.",
        lat: null,
        lng: null
      }
    ]
  },
  {
    id: 5,
    date: "26.08",
    weekday: "Miercuri",
    zone: "drum",
    zoneLabel: "Drum",
    title: "Istanbul → Thassos",
    stops: [
      {
        order: 1,
        time: "07:50",
        title: "Plecare — Istanbul, 9 Doors Hotel",
        detail: "Plecare după micul dejun.",
        lat: 41.00349466022244,
        lng: 28.982058250892283
      },
      {
        order: 2,
        time: "11:05", // calculat: 07:50 + 3h15min
        title: "Oprire Turcia",
        detail: "249 km · 3h15min de la plecare.",
        lat: 40.86655042429408,
        lng: 26.422243821440464
      },
      {
        order: 3,
        time: "13:43", // calculat: 11:05 + 2h38min — NU include așteptarea la vamă (variabilă, necunoscută)
        title: "Keramoti — ferry dock",
        detail: "192 km · 2h38min de la oprirea anterioară. Include trecerea vămii TR → GR (durată variabilă, neinclusă în oră — poate ajungi mai târziu).",
        lat: 40.85717051850721,
        lng: 24.70277617852847
      },
      {
        order: 4,
        time: null,
        title: "Feribot Keramoti → Thassos (Limenas)",
        detail: "Fără rezervare — bilet doar la ghișeul din port. Vara, ~38 plecări/zi, la fiecare 30–60 min, 04:30–22:30. Traversare ~35–40 min.",
        lat: null,
        lng: null
      },
      {
        order: 5,
        time: "15:44", // calculat: 13:43 + 2h01min — vezi nota despre vamă la punctul anterior
        title: "Sosire cazare — Villa Lithi, Limenaria",
        detail: "51 km · 2h01min de la Keramoti — notat ca incluzând traversarea cu feribotul (de verificat).",
        lat: 40.63131846606661,
        lng: 24.57813193320064
      }
    ]
  },
  {
    id: 6,
    date: "27.08",
    weekday: "Joi",
    zone: "thassos",
    zoneLabel: "Thassos",
    title: "Bucla sud-est",
    stops: [
      {
        order: 1,
        time: null,
        title: "Giola Lagoon",
        detail: "24 min de la cazare (Villa Lithi).",
        story: "Un bazin natural săpat în stâncă de mare, umplut cu apă prin crăpături subterane — locul unde localnicii sar de pe stânci de generații.",
        lat: 40.5861,
        lng: 24.6786 // de verificat
      },
      {
        order: 2,
        time: null,
        title: "Livadi Beach",
        detail: "5 min de la Giola Lagoon.",
        story: "Plajă mică, ascunsă între stânci, accesibilă doar pe o potecă scurtă — motivul pentru care rămâne mai liniștită decât vecinele ei.",
        lat: 40.59821,
        lng: 24.691684 // de verificat
      },
      {
        order: 3,
        time: null,
        title: "Mănăstirea Arhanghelul Mihail",
        detail: "4 min de la Livadi Beach.",
        story: "Mănăstire ortodoxă construită direct în stâncă, deasupra mării. Se spune că a fost ridicată acolo unde un cioban a găsit o icoană a Arhanghelului Mihail.",
        lat: 40.5968,
        lng: 24.7014 // de verificat
      },
      {
        order: 4,
        time: null,
        title: "Aliki Beach",
        detail: "11 min de la Livadi Beach.",
        story: "Fostă carieră antică de marmură, azi plajă dublă cu apă turcoaz peste blocuri de marmură scufundate — marmura din care s-au construit temple în toată Grecia antică.",
        lat: 40.605118,
        lng: 24.741690 // de verificat
      },
      {
        order: 5,
        time: null,
        title: "Paradise Beach",
        detail: "13 min de la Aliki Beach.",
        story: "Nisip fin și ape line, cu numele pe care i l-au dat exact turiștii care au ajuns aici prima dată.",
        lat: 40.64496,
        lng: 24.767042 // de verificat
      },
      {
        order: 6,
        time: null,
        title: "Golden Beach",
        detail: "22 min de la Paradise Beach.",
        story: "Cea mai lungă plajă a insulei, cu nisip auriu adus de vânturile din nord — cel mai animat punct turistic al coastei de est.",
        lat: 40.70877,
        lng: 24.760077 // de verificat
      }
    ]
  },
  {
    id: 7,
    date: "28.08",
    weekday: "Vineri",
    zone: "thassos",
    zoneLabel: "Thassos",
    title: "Bucla nord-vest",
    stops: [
      {
        order: 1,
        time: null,
        title: "Marble Beach",
        detail: "Prima oprire, dis-de-dimineață — se aglomerează repede, e cea mai frumoasă plajă. (Ordinea e inversată intenționat.)",
        story: "Saliara — o plajă de marmură albă, rest al unei cariere active până în anii '80. Apa turcoaz peste pietriș alb pare ireală dimineața devreme, înainte să ajungă lumea.",
        lat: 40.7505,
        lng: 24.7481 // de verificat
      },
      {
        order: 2,
        time: null,
        title: "La Scala",
        detail: "24 min de la Marble Beach.",
        story: "Sat de pescari de pe coasta de vest, cu bărci trase pe nisip și taverne mici direct pe plajă — Thassos-ul mai puțin turistic.",
        lat: 40.77946,
        lng: 24.6131 // de verificat — presupus Skala Rachoniou, numele exact nu e clar în brief, confirmă
      },
      {
        order: 3,
        time: null,
        title: "Glifoneri",
        detail: "9 min de la La Scala.",
        story: "Plajă mică, împădurită cu pini până la apă, cunoscută pentru apa ei limpede și liniștea rară pentru un loc atât de aproape de sat.",
        lat: 40.7930434,
        lng: 24.6327833 // de verificat
      },
      {
        order: 4,
        time: null,
        title: "Blue Lake",
        detail: "7 min de la Glifoneri.",
        story: "Un golf mic cu apă atât de limpede și de calmă încât pare mai degrabă un lac decât mare — de unde și numele.",
        lat: 40.776626,
        lng: 24.598485 // de verificat
      }
    ]
  },
  {
    id: 8,
    date: "29.08",
    weekday: "Sâmbătă",
    zone: "drum",
    zoneLabel: "Drum",
    title: "Thassos → București",
    stops: [
      {
        order: 1,
        time: "07:30–08:00",
        title: "Plecare — Villa Lithi, Limenaria",
        detail: "Spre portul Thassos (Limenas), pentru feribot.",
        lat: 40.63131846606661,
        lng: 24.57813193320064
      },
      {
        order: 2,
        time: null,
        title: "Feribot Thassos (Limenas) → Keramoti",
        detail: "Fără rezervare — bilet la ghișeu. Prima plecare 04:30, la fiecare 30–60 min. Traversare ~35–40 min.",
        lat: 40.85717051850721,
        lng: 24.70277617852847
      },
      {
        order: 3,
        time: null,
        title: "Oprire — alimentare (Xanthi, Grecia)",
        detail: "TODO: km și durată — rută estimată, de confirmat.",
        lat: 41.1353,
        lng: 24.8883 // de verificat — traseu estimat, nu e traseul real trimis
      },
      {
        order: 4,
        time: null,
        title: "Oprire — alimentare (Kardzhali, Bulgaria)",
        detail: "TODO: km și durată — rută estimată, de confirmat. Include trecerea vămii GR → BG (durată variabilă, neinclusă), probabil pe la Makaza.",
        lat: 41.6500,
        lng: 25.3800 // de verificat — traseu estimat, nu e traseul real trimis
      },
      {
        order: 5,
        time: null,
        title: "Oprire — alimentare (Veliko Tarnovo, Bulgaria)",
        detail: "TODO: km și durată — rută estimată, de confirmat.",
        lat: 43.0757,
        lng: 25.6172 // de verificat — traseu estimat, nu e traseul real trimis
      },
      {
        order: 6,
        time: null,
        title: "Sosire — București, Berceni",
        detail: "TODO: km și durată de la ultima oprire — rută estimată, de confirmat. Include trecerea vămii BG → RO (probabil Ruse–Giurgiu).",
        lat: 44.359699982039075,
        lng: 26.15083627478914
      }
    ]
  }
];

const PROFILES = [
  {
    initial: "M",
    photo: "madalin.jpg",
    name: "Mădălin",
    title: "Șoferul",
    quote: "Nu întreb dacă oprim. Întreb unde.",
    description: "Ține volanul de la Berceni până la Sultanahmet și înapoi. Ziua lucrează pe financiar la corporație, seara construiește ceva al lui. Trage de fiare cu disciplină și de poftele Alinei cu și mai multă. Singurul defect documentat: relația lui cu aspiratorul.",
    role: "Șofer principal · casier de bord",
    mustDo: null // TODO — de completat
  },
  {
    initial: "A",
    photo: "alina.jpg",
    name: "Alina",
    title: "Omul de bază",
    quote: "Lasă, mă ocup eu.",
    description: "Inginer la Huawei, deci dacă pică netul, ea îl repară. Colecționează bronz și seturi de unghii, iar când tace înseamnă că pregătește o glumă. Instanța supremă în materie de curățenie — verdictele sunt definitive și fără drept de apel.",
    role: "Navigator · control calitate",
    mustDo: null // TODO — de completat
  },
  {
    initial: "B",
    photo: "bianca.jpg",
    name: "Bianca",
    title: "Sufletul petrecerii",
    quote: "V-am adus ceva. Și încă ceva.",
    description: "Predă biologie, administrează un magazin și ridică greutăți — de obicei în aceeași zi. Apare mereu cu ceva pentru toată lumea și nu acceptă mulțumiri. Apartamentul ei din Constanța a găzduit mai multe vacanțe decât unele hoteluri.",
    role: "Logistică · fotograf oficial",
    mustDo: null // TODO — de completat
  }
];
