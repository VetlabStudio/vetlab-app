import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'À propos du contenu',
    icone: 'ti-books',
    paragraphes: [
      'Le contenu d\'ADJUVET (dosages, protocoles, valeurs de référence, guides) a été élaboré à partir de sources reconnues en médecine vétérinaire. Voici les références utilisées.',
    ],
  },
  {
    titre: 'Soins généraux',
    icone: 'ti-stethoscope',
    paragraphes: [],
    liste: [
      'WORTINGER, A. et BURNS, K.M. Nutrition and Disease Management for Veterinary Technicians and Nurses (3e éd.). Wiley Blackwell, 2024, 477 p.',
      'SIROIS, M. Mosby\'s veterinary PDQ: Veterinary facts at hand (3e éd.). Elsevier, 2018, 326 p.',
      'HOLMSTROM, S.E. Veterinary Dental Techniques for the Small Animal Practitioner (3e éd.). Elsevier, 2004, 701 p.',
      { texte: 'MSD MANUAL, Veterinary Manual. En ligne :', href: 'https://www.msdvetmanual.com/' },
      { texte: 'VCA Animal Hospitals. En ligne :', href: 'https://vcahospitals.com/know-your-pet/feline-calicivirus-infection' },
      { texte: 'American Veterinary Dental College. En ligne :', href: 'https://avdc.org/' },
      { texte: 'Université de Montréal, CHUV. En ligne :', href: 'https://chuv.umontreal.ca/' },
      { texte: 'Université de Guelph. En ligne :', href: 'https://www.vetsurgeryonline.com/' },
      { texte: 'Association canadienne des médecins vétérinaires. En ligne :', href: 'https://www.canadianveterinarians.net' },
      { texte: 'The American Animal Hospital Association (AAHA). En ligne :', href: 'https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/' },
    ],
  },
  {
    titre: 'Pharmacologie',
    icone: 'ti-pill',
    paragraphes: [],
    liste: [
      'HOVDA, L.R., BRUTLAG, A.G., POPPENGA, R.H. et EPSTEIN, S.E. Blackwell\'s Five-Minute Veterinary Consult Clinical Companion: Small Animal Toxicology (3e éd.). Wiley Blackwell, 2024, 947 p.',
      'SIROIS, M. Mosby\'s veterinary PDQ: Veterinary facts at hand (3e éd.). Elsevier, 2018, 326 p.',
      'PLUMB, C. Plumb\'s Veterinary Drug Handbook (7e éd.). PharmaVet Inc, 2011, 1299 p.',
      'PETERSON, M.E., KUTZLER, M.-A. Small Animal Pediatrics. Elsevier, 2011, 544 p.',
      { texte: 'MERCK MANUAL, Veterinary Manual. En ligne :', href: 'https://www.merckvetmanual.com/pharmacology/' },
      { texte: 'ASPCA Animal Poison Control. En ligne :', href: 'https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants' },
    ],
  },
  {
    titre: 'Chirurgie',
    icone: 'ti-scissors',
    paragraphes: [],
    liste: [
      'KO, J. Small Animal Anesthesia and Pain Management: A Color Handbook (3e éd.). CRC Press, 2024, 479 p.',
      'SIROIS, M., SCHLIPF, J. Anesthesia and Analgesia for Veterinary Technicians and Nurses (6e éd.). Elsevier, 2024, 468 p.',
      'SIROIS, M. Mosby\'s veterinary PDQ: Veterinary facts at hand (3e éd.). Elsevier, 2018, 326 p.',
      { texte: 'American Animal Hospital Association. En ligne :', href: 'https://www.aaha.org/resources/' },
      { texte: 'Association of Veterinary Anaesthetists (AVA) — Anaesthetic Safety Checklists. En ligne :', href: 'https://ava.eu.com/resources/checklists/' },
    ],
  },
  {
    titre: 'Laboratoire',
    icone: 'ti-microscope',
    paragraphes: [],
    liste: [
      'BURTON, A.B. Clinical Atlas of Small Animal Cytology and Hematology (2e éd.). Wiley Blackwell, 2024, 573 p.',
      'MACNEILL, A.L., BARGER, A.M. Clinical Pathology and Laboratory Techniques for Veterinary Technicians (2e éd.). Wiley Blackwell, 2024, 365 p.',
      'HENDRIX, C.M., ROBINSON, E. Diagnostic Parasitology for Veterinary Technicians (6e éd.). Elsevier, 2023, 433 p.',
      'RASKIN, R.E., MEYER, D.J., BOES, K.M. Canine and Feline Cytopathology: A Color Atlas and Interpretation Guide (4e éd.). Elsevier, 2022, 746 p.',
      'SIROIS, M. Mosby\'s veterinary PDQ: Veterinary facts at hand (3e éd.). Elsevier, 2018, 326 p.',
      'RESSEL, L. Normal Cell Morphology in Canine and Feline Cytology — An Identification Guide. Wiley Blackwell, 2017, 191 p.',
      { texte: 'University of Minnesota. En ligne :', href: 'https://vetmed.umn.edu/urolith-center' },
      { texte: 'University of Saskatchewan. En ligne :', href: 'https://wcvm.usask.ca/learnaboutparasites/index.php' },
      { texte: 'Minnesota Department of Health — Darkroom Fog Test. En ligne :', href: 'https://www.health.state.mn.us/communities/environment/radiation/xray/darkfogmed.html' },
    ],
  },
]

export default function SourcesReferences() {
  return <PageInfo sections={SECTIONS} />
}
