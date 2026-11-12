/* Valeurs de référence des espèces exotiques.
   Fichier généré. Petits mammifères : tableaux transcrits du Graham et al. (2021) :
   9.1 (hématocrite, protéines), 9.4 (glycémie), 9.5 (lactate), 9.6 et 9.7
   (température, fréquences), 11.5 (biochimie rénale), 11.9 et 12.1 (urine).
   Retirés en attendant une deuxième source : le phosphore du lapin (même
   valeur que la créatinine dans le livre) et la fréquence respiratoire du
   rat (une seule valeur au lieu d'un intervalle).
   Oiseaux, reptiles, amphibiens et poissons : Carpenter's Exotic Animal
   Formulary (6e éd.), tableaux 2-6, 3-9, 4-12 à 4-14, 4-20, 5-19, 5-21,
   5-33 et 5-34 (une seule source pour le moment).
   Une espèce peut regrouper plusieurs sujets (rongeurs : rat, souris,
   hamster, gerbille ; oiseaux : perruche ondulée, calopsitte...). */
export const VALEURS_EXOTIQUES = {
  "lapin": [
    {
      "nom": "Lapin",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "38,5–39,5 (101,3–103,1)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–300"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "32–60"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "34–43"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,0–7,5"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "74–148",
              "detail": "soit 4,1–8,2 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "6,9 ± 2,7",
              "detail": "analyseur portable"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "7,1 ± 1,6",
              "detail": "analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "13–29"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,5–2,5"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,6–12,5"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,036"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "Traces"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "8,2–8,8"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "130 par kg"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Rouge, orange, brune ou jaune clair ; blanche trouble et turbide"
            }
          ]
        }
      ]
    }
  ],
  "furet": [
    {
      "nom": "Furet",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,8–40,0 (100,0–104,0)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–400"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "33–36"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "47–59"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,0–6,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "99–135",
              "detail": "soit 5,5–7,5 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,3–1,5",
              "detail": "analyseur portable"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "10–45"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,4–0,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "4,0–9,1"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,0–11,8"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "Mâles 1,034–1,070 ; femelles 1,026–1,060"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "0–33"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,5–7,5"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "26–140"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Transparente, jaune plus ou moins foncé"
            }
          ]
        }
      ]
    }
  ],
  "cobaye": [
    {
      "nom": "Cobaye",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,2–39,5 (99,0–103,1)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "230–380"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "42–104"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "43 ± 12"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,5–5,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "80–110",
              "detail": "soit 4,4–6,1 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,11–0,56",
              "detail": "anglais à poil court, analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,003–0,73",
              "detail": "lignée Dunkin-Hartley, analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "9,0–31,5"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,6–2,2"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,0–7,6"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,2–12,0"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "pH",
              "unite": "",
              "valeur": "9,0"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Jaune ambré ; opaque"
            }
          ]
        }
      ]
    }
  ],
  "chinchilla": [
    {
      "nom": "Chinchilla",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37–38 (98,6–100,4)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–350"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "45–80"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "37 (35–40)"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6 (5,3–6,0)"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "180 (163–197)",
              "detail": "soit 9,0–10,9 mmol/L"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,014 à > 1,060"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "6–87"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "8,5"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Jaune ambré"
            }
          ]
        }
      ]
    }
  ],
  "rongeur": [
    {
      "nom": "Rat",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,5 (99,5)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "250–500"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "33–47"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6–7,4"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "50–135",
              "detail": "soit 2,8–7,5 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "1,9–5,61",
              "detail": "mâles (rats Wistar), analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "1,15–5,42",
              "detail": "femelles (rats Wistar), analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "15–21"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,2–0,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "5,3–8,3"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,3–13,0"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,022–1,050"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "< 30"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "7,0–7,4"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "13–23"
            }
          ]
        }
      ]
    },
    {
      "nom": "Souris",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37–37,2 (98,8–99,3)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "310–840"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "60–220"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "34–50"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,6–6,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "90–193",
              "detail": "soit 5,0–10,7 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,04–1,09",
              "detail": "mâles (souris C57BL/6), analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,04–0,8",
              "detail": "femelles (souris C57BL/6), analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "27,5–34,7"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,74–1,01"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "10,4–13,8"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10,7–12,4"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,034–1,058"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "7,3–8,5"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "0,5–2,5"
            }
          ]
        }
      ]
    },
    {
      "nom": "Hamster",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "36,2–37,5 (97,2–99,5)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "280–412"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "33–127"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "45–52"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,2–7,0"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "84,0 ± 18,5 (M) ; 100,0 ± 16,6 (F)"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "12–25"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,91–0,99"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,4–8,2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5–12"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,050–1,060"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Basique"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "5,1–8,4"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Trouble"
            }
          ]
        }
      ]
    },
    {
      "nom": "Gerbille",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "38,2 (100,8)"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "41–52"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6 (4,6–6,3)"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "17–27"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,6–1,4"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,7–6,2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "3,7–6,1"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "Quelques gouttes à 4 mL"
            }
          ]
        }
      ]
    }
  ],
  "herisson": [
    {
      "nom": "Hérisson",
      "source": "Exotic Animal Emergency and Critical Care Medicine (Graham et al., 2021)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "35,4–37,0 (95,7–98,6)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "180–280"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "25–50"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "36 ± 7"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,8 ± 0,7"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "89 ± 30"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "13–54"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,4–0,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,4–12,0"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,2–11,3"
            }
          ]
        }
      ]
    }
  ],
  "oiseau": [
    {
      "nom": "Perruche ondulée",
      "latin": "Melopsittacus undulatus",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "60–75",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "44–58"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "3–10"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2–3"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "254–399",
              "detail": "soit 14,1–22,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "3–8,6"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "3–5,2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "6,4–11,2"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3–5,2"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "139–159"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,2–3,7"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "55–154"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "54–252"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Calopsitte",
      "latin": "Nymphicus hollandicus",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "40–50",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "43–57"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "5–11"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,4–4,8"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,78–1,75"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "249–363",
              "detail": "soit 13,8–20,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "3,5–11"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "2,9–5"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,3–10,7"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,2–4,8"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "130–153"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,4–4,6"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "160–383"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "58–245"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Inséparables",
      "latin": "Agapornis spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "50–60",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "44–55"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "7–16"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,4–3,6"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,98–1,68"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "246–381",
              "detail": "soit 13,7–21,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "2,5–12"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "2,8–5,5"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,2–10,6"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,8–4,9"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "125–155"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,1–4,8"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "125–377"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "58–337"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Conures",
      "latin": "Aratinga et Pyrrhura spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "30–50",
              "detail": "grandes conures 30–45, petites 40–50, au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "42–54"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "5–13"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,8–4,6"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,01–1,94"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "217–323",
              "detail": "soit 12,0–17,9 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "3,0–11,4"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "2,5–5,4"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,9–10,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2–10"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "135–149"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,4–5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "178–307"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "154–355"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Gris du Gabon",
      "latin": "Psittacus spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "45–53"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "6–13"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,2–5,2"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,22–2,52"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "206–275",
              "detail": "soit 11,4–15,3 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "2,7–8,8"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "3–5,4"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,7–11,3"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,2–5,4"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "157–165"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,9–4,6"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "109–305"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "228–322"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Amazones",
      "latin": "Amazona spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "15–45",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "41–53"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "6–17"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3–5,2"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,79–2,81"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "221–302",
              "detail": "soit 12,3–16,8 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "2,1–8,7"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,2–10,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,1–5,5"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "125–155"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3–4,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "141–437"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "125–345"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Cacatoès",
      "latin": "Cacatuidae",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "15–40",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "40–54"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "5–13"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3–5"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,11–2,28"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "214–302",
              "detail": "soit 11,9–16,8 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "2,9–11,0"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "3–5,1"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,3–10,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,5–5,5"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "130–155"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,5–4,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "117–314"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "106–305"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Aras",
      "latin": "Ara et Anodorhynchus spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "20–25",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "42–56"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "10–20"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,6–5,0"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,12–2,43"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "228–325",
              "detail": "soit 12,7–18,0 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "2,9–10,6"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "3–5,6"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,2–10,9"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "140–165"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2–5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "105–324"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "101–300"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    },
    {
      "nom": "Canari",
      "latin": "Serinus canaria",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "60–80",
              "detail": "au repos ; la contention peut la multiplier par 1,5 à 2"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "45–56"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "3–10"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,8–4,5"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "205–435",
              "detail": "soit 11,4–24,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "4–12"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,5–13,5"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,9–4,9"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "135–165"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,2–4,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "14–345"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "55–350"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,005–1,020"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,4–8",
              "detail": "plus acide chez les pondeuses et les carnivores"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Négatif à traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "",
              "valeur": "Négatif à traces"
            }
          ]
        }
      ]
    }
  ],
  "serpent": [
    {
      "nom": "Python royal",
      "latin": "Python regius",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "10–33",
              "detail": "moyenne 24"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "2,22–21,6",
              "detail": "moyenne 7,46"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,6–9,0",
              "detail": "moyenne 6,8"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,1–3,6",
              "detail": "moyenne 2,1"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "8–53",
              "detail": "moyenne 25, soit 0,4–2,9 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,8–8,3",
              "detail": "moyenne 3,0"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "0–7",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10,4–19,3",
              "detail": "moyenne 14,7"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,4–7,3",
              "detail": "moyenne 3,0"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "137–171",
              "detail": "moyenne 153"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,4–10,0",
              "detail": "moyenne 5,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "4–97",
              "detail": "moyenne 25"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "55–2136",
              "detail": "moyenne 526"
            }
          ]
        }
      ]
    },
    {
      "nom": "Boa constricteur",
      "latin": "Boa constrictor",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "12–40",
              "detail": "moyenne 29"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,47–19,6",
              "detail": "moyenne 7,37"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,0–10,3",
              "detail": "moyenne 7,0"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,6–4,3",
              "detail": "moyenne 2,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "7–74",
              "detail": "moyenne 34, soit 0,4–4,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,3–15,0",
              "detail": "moyenne 4,0"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "0–8",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10–20",
              "detail": "moyenne 15,3"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,4–8,6",
              "detail": "moyenne 4,3"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "143–173",
              "detail": "moyenne 159"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,1–7,3",
              "detail": "moyenne 4,7"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "2–64",
              "detail": "moyenne 15"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "57–2099",
              "detail": "moyenne 489"
            }
          ]
        }
      ]
    },
    {
      "nom": "Serpent des blés",
      "latin": "Elaphe guttata",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "13–50",
              "detail": "moyenne 30"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,12–16,9",
              "detail": "moyenne 5,93"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,3–10,7",
              "detail": "moyenne 7,0"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,0–3,4",
              "detail": "moyenne 2,1"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "17–92",
              "detail": "moyenne 49, soit 0,9–5,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "1,0–13,6",
              "detail": "moyenne 4,4"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–6",
              "detail": "moyenne 3"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "11,9–19,9",
              "detail": "moyenne 15,6"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,8–8,0",
              "detail": "moyenne 3,7"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "149–181",
              "detail": "moyenne 162"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "1,8–9,1",
              "detail": "moyenne 4,9"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "4–149",
              "detail": "moyenne 25"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "31–967",
              "detail": "moyenne 270"
            }
          ]
        }
      ]
    },
    {
      "nom": "Serpent-roi commun",
      "latin": "Lampropeltis getula",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "9–47",
              "detail": "moyenne 31"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,55–27,7",
              "detail": "moyenne 7,45"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,8–10,3",
              "detail": "moyenne 6,4"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,8–2,9",
              "detail": "moyenne 1,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "8–92",
              "detail": "moyenne 38, soit 0,4–5,1 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "1,4–16,0",
              "detail": "moyenne 4,6"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–10",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "9,1–22,2",
              "detail": "moyenne 14,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,7–11,3",
              "detail": "moyenne 3,8"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "140–180",
              "detail": "moyenne 161"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,3–9,2",
              "detail": "moyenne 4,6"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "4–107",
              "detail": "moyenne 20"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "59–1909",
              "detail": "moyenne 406"
            }
          ]
        }
      ]
    }
  ],
  "lezard": [
    {
      "nom": "Dragon barbu",
      "latin": "Pogona vitticeps",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "17–45",
              "detail": "moyenne 30"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,45–19,0",
              "detail": "moyenne 6,21"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,0–8,1",
              "detail": "moyenne 5,0"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,2–4,0",
              "detail": "moyenne 2,5"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "108–333",
              "detail": "moyenne 202, soit 6,0–18,5 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,5–9,8",
              "detail": "moyenne 3,1"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–5",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,6–18",
              "detail": "moyenne 11,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,1–10,6",
              "detail": "moyenne 4,4"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "140–179",
              "detail": "moyenne 157"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "1,5–7,1",
              "detail": "moyenne 4,0"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "2–90",
              "detail": "moyenne 20"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "33–4042",
              "detail": "moyenne 563"
            }
          ]
        }
      ]
    },
    {
      "nom": "Gecko léopard",
      "latin": "Eublepharis macularius",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "21–40",
              "detail": "moyenne 31"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,5–6,6",
              "detail": "moyenne 2,1"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "14 à plus de 37",
              "detail": "moyenne 25, femelles (ponte)"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,5–16,4",
              "detail": "moyenne 5,6"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "11–65",
              "detail": "moyenne 29"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "0–3701",
              "detail": "moyenne 430"
            }
          ]
        }
      ]
    },
    {
      "nom": "Caméléon casqué",
      "latin": "Chamaeleo calyptratus",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "12–37",
              "detail": "moyenne 24"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,20–21,0",
              "detail": "moyenne 6,30"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,4–10,9",
              "detail": "moyenne 6,4"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,4–4,2",
              "detail": "moyenne 3,1"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "125–444",
              "detail": "moyenne 270, soit 6,9–24,6 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0–21,9",
              "detail": "moyenne 5,6"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,7–14,5",
              "detail": "moyenne 11,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "4,4–16,1",
              "detail": "moyenne 8,4"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "132–169",
              "detail": "moyenne 144"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,5–12,0",
              "detail": "moyenne 6,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "93–967",
              "detail": "moyenne 397"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "5–8905",
              "detail": "moyenne 1873"
            }
          ]
        }
      ]
    },
    {
      "nom": "Scinque à langue bleue",
      "latin": "Tiliqua scincoides",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "16–39",
              "detail": "moyenne 28"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "2,00–17,7",
              "detail": "moyenne 5,93"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,7–8,5",
              "detail": "moyenne 6,1"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,1–3,1",
              "detail": "moyenne 2,1"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "72–202",
              "detail": "moyenne 127, soit 4,0–11,2 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,6–9,5",
              "detail": "moyenne 2,7"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–27",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10,0–15,9",
              "detail": "moyenne 12,7"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,3–10,8",
              "detail": "moyenne 4,4"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "139–175",
              "detail": "moyenne 151"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,3–7,9",
              "detail": "moyenne 5,1"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "5–80",
              "detail": "moyenne 20"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "59–5570",
              "detail": "moyenne 629"
            }
          ]
        }
      ]
    }
  ],
  "tortue": [
    {
      "nom": "Tortue d'Hermann",
      "latin": "Testudo hermanni",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "11–40",
              "detail": "moyenne 23"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "2,4–15,3",
              "detail": "moyenne 9,4"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,6–6,1",
              "detail": "moyenne 4,3"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,8–2,6",
              "detail": "moyenne 1,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "15–120",
              "detail": "moyenne 68, soit 0,8–6,7 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0–5,2",
              "detail": "moyenne 2,6"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "4,8–20,5",
              "detail": "moyenne 12,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "0,6–5,5",
              "detail": "moyenne 3,1"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "116–143",
              "detail": "moyenne 130"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,5–7,7",
              "detail": "moyenne 5,6"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "0–359",
              "detail": "moyenne 74"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "0–732",
              "detail": "moyenne 168"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortue des steppes (de Horsfield)",
      "latin": "Testudo horsfieldii",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "22–34",
              "detail": "moyenne 23"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "5–12,5",
              "detail": "moyenne 8,5"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,5–4,6",
              "detail": "moyenne 3"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,2–2,3",
              "detail": "moyenne 1,6"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "40–86",
              "detail": "moyenne 59, soit 2,2–4,8 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,8–3,9",
              "detail": "moyenne 1,2"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "4–17",
              "detail": "moyenne 12"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "9,9–19,5",
              "detail": "moyenne 13,2"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,3–3,9",
              "detail": "moyenne 2,6"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "131–149",
              "detail": "moyenne 138"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "1,9–7,2",
              "detail": "moyenne 5,3"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "12–32",
              "detail": "moyenne 20"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "6–344",
              "detail": "moyenne 123"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortue sillonnée",
      "latin": "Centrochelys sulcata",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "9–43",
              "detail": "moyenne 28"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "0,87–13,23",
              "detail": "moyenne 4,41"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "1,2–6,3",
              "detail": "moyenne 3,8"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0–2,3",
              "detail": "moyenne 1,5"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "55–220",
              "detail": "moyenne 107, soit 3,1–12,2 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,6–10,4",
              "detail": "moyenne 4,6"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–6",
              "detail": "moyenne 3"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,8–21,2",
              "detail": "moyenne 11,4"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,5–6,5",
              "detail": "moyenne 3,8"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "125–154",
              "detail": "moyenne 139"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,3–11,9",
              "detail": "moyenne 6,1"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "34–401",
              "detail": "moyenne 108"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "31–2088",
              "detail": "moyenne 407"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortue léopard",
      "latin": "Stigmochelys pardalis",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "8–37",
              "detail": "moyenne 23"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "0,6–10,0",
              "detail": "moyenne 4,24"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "1,9–6,2",
              "detail": "moyenne 3,3"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,3–2,9",
              "detail": "moyenne 1,6"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "10–152",
              "detail": "moyenne 75, soit 0,6–8,4 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,5–6,6",
              "detail": "moyenne 2,5"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–36",
              "detail": "moyenne 12"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "6,5–18,3",
              "detail": "moyenne 11,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,1–5,2",
              "detail": "moyenne 2,7"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "115–148",
              "detail": "moyenne 132"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,3–8,8",
              "detail": "moyenne 5,4"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "5–119",
              "detail": "moyenne 54"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "223–704",
              "detail": "moyenne 359"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortue charbonnière",
      "latin": "Chelonoidis carbonaria",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "6–38",
              "detail": "moyenne 25"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,15–20,0",
              "detail": "moyenne 6,51"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "1,9–7,4",
              "detail": "moyenne 4,7"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0–3,0",
              "detail": "moyenne 1,6"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "13–154",
              "detail": "moyenne 67, soit 0,7–8,5 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,1–2,1",
              "detail": "moyenne 0,6"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "1–34",
              "detail": "moyenne 14"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,1–24,1",
              "detail": "moyenne 12,2"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,0–8,3",
              "detail": "moyenne 3,5"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "117–143",
              "detail": "moyenne 130"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,8–9,4",
              "detail": "moyenne 5,5"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "20–406",
              "detail": "moyenne 130"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "54–3593",
              "detail": "moyenne 695"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortues de Floride (trachémydes)",
      "latin": "Trachemys scripta spp.",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "8–44",
              "detail": "moyenne 26"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,0–19,4",
              "detail": "moyenne 6,73"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "1,1–8,8",
              "detail": "moyenne 4,8"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,6–3,3",
              "detail": "moyenne 1,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "21–143",
              "detail": "moyenne 54, soit 1,2–7,9 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,1–1,9",
              "detail": "moyenne 0,8"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "2–64",
              "detail": "moyenne 23"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "6,5–22,6",
              "detail": "moyenne 12,6"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,8–8,8",
              "detail": "moyenne 4,0"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "123–147",
              "detail": "moyenne 134"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "2,4–7,5",
              "detail": "moyenne 3,8"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "44–358",
              "detail": "moyenne 141"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "108–2125",
              "detail": "moyenne 516"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    },
    {
      "nom": "Tortue-boîte de l'Est",
      "latin": "Terrapene carolina",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "8–37",
              "detail": "moyenne 24"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "1,34–15,9",
              "detail": "moyenne 5,48"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "3,10–3,90",
              "detail": "moyenne 3,20"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,2–3,2",
              "detail": "moyenne 2,2"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "23–114",
              "detail": "moyenne 48, soit 1,3–6,3 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,1–2,9",
              "detail": "moyenne 0,7"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "6–121",
              "detail": "moyenne 52"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "6,8–23,2",
              "detail": "moyenne 10,5"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "1,7–7,5",
              "detail": "moyenne 3,5"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "120–155",
              "detail": "moyenne 139"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "3,1–9,4",
              "detail": "moyenne 4,7"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "14–191",
              "detail": "moyenne 64"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "23–747",
              "detail": "moyenne 153"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,014",
              "detail": "moyenne 1,008"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Herbivores : alcalin ; omnivores : 5–8"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "",
              "valeur": "Traces"
            },
            {
              "nom": "Glucose urinaire",
              "unite": "mg/dL",
              "valeur": "Jusqu'à 30"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Incolore à jaune pâle, avec des urates blancs ; limpide"
            }
          ]
        }
      ]
    }
  ],
  "poisson": [
    {
      "nom": "Poisson rouge",
      "latin": "Carassius auratus",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "31 ± 7,3"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "0,1–4,02",
              "detail": "moyenne 2,03"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,3–3,2",
              "detail": "moyenne 1,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "15–93",
              "detail": "moyenne 35,7, soit 0,8–5,2 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0–0,2",
              "detail": "moyenne 0,08"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "28",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "4,3–13,5",
              "detail": "moyenne 9,1"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,1–16,3",
              "detail": "moyenne 8,83"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "126–176",
              "detail": "moyenne 139"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "0,1–5,6",
              "detail": "moyenne 2,16"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "111–433",
              "detail": "moyenne 220"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "0–10 000",
              "detail": "moyenne 4515"
            }
          ]
        }
      ]
    },
    {
      "nom": "Carpe koï",
      "latin": "Cyprinus carpio",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "24–43",
              "detail": "moyenne 35"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "19,8–28,1"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,7–4,3",
              "detail": "moyenne 3,4"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,4–2,7",
              "detail": "moyenne 2"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "22–65",
              "detail": "moyenne 37, soit 1,2–3,6 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0–0,5",
              "detail": "moyenne 0,1"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "0,2–5",
              "detail": "moyenne 2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "7,8–11,4",
              "detail": "moyenne 8,7"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,5–7,7",
              "detail": "moyenne 6,1"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "110–143",
              "detail": "moyenne 133"
            },
            {
              "nom": "Potassium",
              "unite": "mmol/L",
              "valeur": "0–2,9",
              "detail": "moyenne 1,4"
            },
            {
              "nom": "AST",
              "unite": "UI/L",
              "valeur": "40–381",
              "detail": "moyenne 121"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "80–9014",
              "detail": "moyenne 4123"
            }
          ]
        }
      ]
    }
  ],
  "amphibien": [
    {
      "nom": "Xénope lisse",
      "latin": "Xenopus laevis",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "23–47"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "0,64–9,56"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,0–4,6"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "0,1–2,3"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "18–111",
              "detail": "soit 1,0–6,2 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,1–0,4"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "2–10"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,2–12,3"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,5–11,6"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "111–134"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "10–5400"
            }
          ]
        }
      ]
    },
    {
      "nom": "Ouaouaron",
      "latin": "Lithobates catesbeianus",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "14–27"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "5,2",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,6",
              "detail": "une seule valeur publiée, sans intervalle"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,1",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "3",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,1",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,3",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "108",
              "detail": "une seule valeur publiée, sans intervalle"
            }
          ]
        }
      ]
    },
    {
      "nom": "Rainette verte australienne",
      "latin": "Ranoidea caerulea",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "34–41"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "12,4–22,1"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,5–6,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "55–78",
              "detail": "soit 3,1–4,3 mmol/L"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Acide urique",
              "unite": "mg/dL",
              "valeur": "0,2–0,7"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10,6–13,1"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,3–5,0"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "107–114"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "347–705"
            }
          ]
        }
      ]
    },
    {
      "nom": "Grenouille léopard",
      "latin": "Lithobates pipiens",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "♂ 19–52 ; ♀ 16–51"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "♂ 3,1–22,2 ; ♀ 2,8–25,9"
            }
          ]
        }
      ]
    },
    {
      "nom": "Salamandre tigrée de Californie",
      "latin": "Ambystoma californiense",
      "source": "Carpenter's Exotic Animal Formulary (6e éd.)",
      "sections": [
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "48",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Globules blancs",
              "unite": "10³/µL",
              "valeur": "0,55",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "2,8",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Albumine",
              "unite": "g/dL",
              "valeur": "1,2",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "30",
              "detail": "une seule valeur publiée, sans intervalle"
            }
          ]
        },
        {
          "titre": "Biochimie",
          "lignes": [
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "9,2",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "6,0",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "Sodium",
              "unite": "mmol/L",
              "valeur": "125",
              "detail": "une seule valeur publiée, sans intervalle"
            },
            {
              "nom": "CK",
              "unite": "UI/L",
              "valeur": "139",
              "detail": "une seule valeur publiée, sans intervalle"
            }
          ]
        }
      ]
    }
  ]
}
