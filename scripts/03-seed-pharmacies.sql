-- Clear existing pharmacy data and insert the complete list
DELETE FROM facilities WHERE type = 'pharmacy';

-- Insert all 303 pharmacies from the provided list
INSERT INTO facilities (name, level, type, district, latitude, longitude) VALUES
('ABIRWA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('ACCESS', 'Community', 'pharmacy', 'GICUMBI', -1.4833, 29.8667),
('ADONAI PHARMACY Ltd', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('ADRENALINE PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('AGAPE PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('AKEDAH Ltd PHARMACY', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('ALAMANDA PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ALCRESTA PHARMACY Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('ALLIANCE PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('ALLIMED', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('ALVIN PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('AMIPHAR', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('AMAYA', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('AMIGO PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('AMIRAH', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('AMIZERO PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ANGE DIVINE', 'Community', 'pharmacy', 'GAKENKE', -1.6833, 29.8000),
('ANSWER PHARMACIE Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('APOTHECARY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('AUBENE PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('AVAM Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('AVEPHARMA Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('AVIL PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('AXIS PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('AYIBAMBE PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('BAHONEZA PHARMACY Ltd', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('BELLE VIE PHARMACY /MUHIMA Br.', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('BELLE VIE PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('BENYPHARMA', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('BGK PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('BIPA PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('BLESSING PHARMACY', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('BONA CURATIO FARMACIA COMPANY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('BONITAS DEI PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('BORA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('BOVAN PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('BRUCE PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('CAREPOINT PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('CELIA Ltd', 'Community', 'pharmacy', 'KAYONZA', -1.8833, 30.6167),
('CITIPHARMA Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('CONCORDE', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('CONSEIL', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('CONSEIL KACYIRU', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('CONTINENTALE', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DASS PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DAVY''S PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DAYENU PHARMACY Ltd', 'Community', 'pharmacy', 'KARONGI', -2.0000, 29.4167),
('DE LA MISERICORDE Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('DELIGHT PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DELIZA PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('DENA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DEPHAR PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('DESTINY PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('DIGNE PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DIVA PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('DOLCE & BELLA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DORRIE Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('DU CALME', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('DU PHARE Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('DU PROGRES', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('EAGLE PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('EBENEPHAR PHARMACY Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('EL DORADO PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('ELIOT PHARMACY Ltd', 'Community', 'pharmacy', 'NYAGATARE', -1.2833, 30.3333),
('ELITE PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ELLIO PHARMA Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('ELVINO PHARMACY', 'Community', 'pharmacy', 'NYAMASHEKE', -2.3167, 29.1167),
('EMMA SANITAS PHARMACY', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('EMMY PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ERVAS PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('EXTREME PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('EZA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('FADHIL PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('FAITH PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('FIDELE ISHAMI RYA KACYIRU', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('FIDELE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('FIRST HEALTH CARE PHARMACY', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('FLEUR DE VIE Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('FUTURE HOPE PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('GALEAD PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('GERIC PHARMACY Ltd', 'Community', 'pharmacy', 'RUHANGO', -2.1667, 29.7833),
('GLORY PHARMACY', 'Community', 'pharmacy', 'RUHANGO', -2.1667, 29.7833),
('GOLF PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('GOOD CHOICE PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('GOOD LIFE HEALTH AND BEAUTY GACURIRO', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('GOOD LIFE HEALTH AND BEAUTY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('GOOD LIFE HEALTH AND BEAUTY Ltd MUSANZE BRANCH', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('GOOD LIFE HEALTH AND BEAUTY Ltd NYAKABANDA BRANCH', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('GOOD LIFE PHARMACY Ltd', 'Community', 'pharmacy', 'NYABIHU', -1.6833, 29.5167),
('GOOD SAMARITAN PHARMACY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('HEAL PHARMACY Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('HEALTHCARE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('HELPHARMA PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('HERIT PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('HIGH MAGNIFICAT PHARMACY', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('HIGH MAGNIFICAT PHARMACY Ltd Branch GOICO', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('HIGHLANDS''PHARMACY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('HILDA PHARMACY Ltd', 'Community', 'pharmacy', 'GATSIBO', -1.6167, 30.4333),
('HOLY PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('HOSANNA Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('IGIHOZO PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('IHIRWE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('IHODI PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('IKAZE PHARMACY', 'Community', 'pharmacy', 'KIREHE', -2.2167, 30.7167),
('IMPRESS PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('INEMA PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('INEPHAR PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('INEZAPHAR', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('INITIATIVE PHARMACY', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('INITIATIVE PHARMACY/Nyanza Branch', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('INTER PHARMACY Ltd', 'Community', 'pharmacy', 'GISAGARA', -2.5333, 29.8333),
('INTWALI PHARMACY Ltd', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('IRAGUHA PHARMACY', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('IRAMIRO PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('IREME PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('IRIS PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('ISANO PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('ISIMBI', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ISONGA PHARMACY Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('IWAWE Ltd', 'Community', 'pharmacy', 'RUHANGO', -2.1667, 29.7833),
('J&M PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('JAYCARE PHARMACY Ltd', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('JAYSON', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('JM PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('JOHN''S PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('JORDAN PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('JOSH PHARMAY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('KAGOPHAR PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('KA-PHARMACY', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('KARO PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('KAVES PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('KEMI', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('KEYSTONE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('KINDNESS PHARMA Ltd', 'Community', 'pharmacy', 'KARONGI', -2.0000, 29.4167),
('KIVU BEACH PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('KUPHARMA PHARMACY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('LA CHARITE', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('LA CROIX DU SUD', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('LA CURA PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('LA LICORNE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('LA PREFERENCE', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('LA PROMISE', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('LA PROVIDENCE PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('LA VANILLE PHARMACY LTD', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('LAGO Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('L''AN 2000 PLUS', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('LELAPHARMA Ltd', 'Community', 'pharmacy', 'KAYONZA', -1.8833, 30.6167),
('LILAC PHARMACY Ltd', 'Community', 'pharmacy', 'KARONGI', -2.0000, 29.4167),
('LUCE PHARMACY Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('LYDDA PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MED POINT PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MEDCONNECT PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('MED-EX PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MEDIASOL PHARMACY/MUSANZE BR.', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('MEDIASOL PHARMACY/RUBAVU BR.', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('MEDIASOL PHCY/KANOMBE BR.', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MEDIASOL PHCY/MAIN BR.', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('MEDIASOL PHCY/REMERA BR.', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('MEDICO PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('MEDIPRO', 'Community', 'pharmacy', 'RUSIZI', -2.4833, 28.9167),
('MEDLIFE PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('MEDLINK PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('MEDPLUS PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('MEMIA''S PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MEMIA''S PHARMACY/NIBOYE BRANCH', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MENIPHAR PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MISSIONPHARMACY', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('MORGAN PHARMACY Ltd', 'Community', 'pharmacy', 'NGORORERO', -1.8833, 29.5333),
('MUHIRE /KANOMBE', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MUHIRE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('MULINDI SUGIRA PHARMACY LTD', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('MUNA PHARMACY Ltd', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('MUSANZE PHARMACY', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('NATANYA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('NEW HOPE PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('NEW SHILOH PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('NEZA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('NGABO PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('NIMA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('NOVA PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('NTENDE PHARMACY Ltd', 'Community', 'pharmacy', 'GATSIBO', -1.6167, 30.4333),
('NURA PHARMACY Ltd', 'Community', 'pharmacy', 'NYANZA', -2.3500, 29.7500),
('OCEANO PHARMAIA Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('OM PHARMACY', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('PAMELLA PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('PANACEA PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('PENIEL PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('PFG PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('PHARMA BEST Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('PHARMA EXPRESS Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('PHARMACARE PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('PHARMACIE DE BUTARE', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('PHARMACURE', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('PHARMAID PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('PHARMAMED PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('PHARMAPAX PHARMACY Ltd', 'Community', 'pharmacy', 'RUSIZI', -2.4833, 28.9167),
('PHARMASAVE', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('PHARMAVIE Ltd BRANCH KIYOVU', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('PILLAR PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('PLIVA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('PRESTIGE PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('PRIMA PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('PULSE PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('QL PHARMA Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('RAFI PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('RAMA PHARMACY Ltd', 'Community', 'pharmacy', 'KIREHE', -2.2167, 30.7167),
('RAVI PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('REGOPHAR Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('REMA PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('REXAPHAR PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('RINDIRO PHARMACY Ltd', 'Community', 'pharmacy', 'NYAMAGABE', -2.4667, 29.6167),
('RITE PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('RITE PHARMACY GATENGA BRANCH', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('RITE PHARMACY GISIMENT BRANCH', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('RITE PHARMACY LTD (SANA PHARMACY)', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('RITE PHARMACY Ltd KACYIRU BRANCH', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('RITE PHARMACY Ltd KANOMBE BRANCH', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('RITE PHARMACY Ltd KICUKIRO BRANCH', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ROYALCARE PHARMACY Ltd', 'Community', 'pharmacy', 'BURERA', -1.4833, 29.8667),
('SABANS PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SABANS PHARMACY KANOMBE BRANCH', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SAINTE THERESE PHARMACY Ltd', 'Community', 'pharmacy', 'GICUMBI', -1.4833, 29.8667),
('SALAMA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('SANGWA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('SANOPHAR PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SCORE PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('SCORE PHARMACY B2 Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('SEMU PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SEMU PHARMACY Ltd,NIBOYE BR.', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SHAMI PHARMA Ltd', 'Community', 'pharmacy', 'NYAMAGABE', -2.4667, 29.6167),
('SHEMA', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('SHENGE Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('SILA PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('SINAPIS PHARMACY Ltd', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('ST ODA Ltd', 'Community', 'pharmacy', 'RULINDO', -1.7667, 30.0833),
('STREAM PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('SUCCESS PHARMACY Ltd', 'Community', 'pharmacy', 'GATSIBO', -1.6167, 30.4333),
('SUNBEAM PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('SUNRISE PHARMACY', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('TAQWA PHARMACY Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('TECHNIPHARMA II LTD', 'Community', 'pharmacy', 'KIGALI', -1.9441, 30.0619),
('TECHNIPHARMA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('TERCERA PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('TETA', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('TETA PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('TETA REMERA BR.', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('THE GUARDIAN PHARMACY', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('THE SPECIALIST PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('THESO PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('TOP PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('TRAMED PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('TREAH PHARMACY Ltd', 'Community', 'pharmacy', 'RWAMAGANA', -1.9536, 30.4336),
('TRESOR PHARMACIE', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('TRUPHAR LIVES PHARMACY Ltd', 'Community', 'pharmacy', 'RUSIZI', -2.4833, 28.9167),
('TUGANE PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('TUMA PHARMACY Ltd', 'Community', 'pharmacy', 'BUGESERA', -2.2167, 30.2833),
('TWITEKUBUZIMA PHARMACIE Ltd', 'Community', 'pharmacy', 'NYAMASHEKE', -2.3167, 29.1167),
('TWIZERE PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('UMUCYO NA GIRUBUZIMA', 'Community', 'pharmacy', 'RUHANGO', -2.1667, 29.7833),
('UMURAVA PHARMACIE', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('UNIKA PHARMACY Ltd', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('UNIPHARMA B1', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('UNIPHARMA B2', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('UNIPHARMA B3', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('UNIPHARMA B4', 'Community', 'pharmacy', 'KIGALI', -1.9441, 30.0619),
('UNIPHARMA B5', 'Community', 'pharmacy', 'KIGALI', -1.9441, 30.0619),
('UNIPHARMA PHARMACY', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('UNIQUE Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('UNIQUE/ KIYOVU', 'Community', 'pharmacy', 'NYARUGENGE', -1.9506, 30.0588),
('URUMULI PHARMACY Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('URUMURI PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('VAN PHARMACY Ltd', 'Community', 'pharmacy', 'KAYONZA', -1.8833, 30.6167),
('VERITAS PHARMACY Ltd', 'Community', 'pharmacy', 'GICUMBI', -1.4833, 29.8667),
('VICTORY PHARMACY', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('VICTORY PHARMACY/MUHANGA', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('VICTORY PHARMACY/NYAMABUYE', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('VIDA PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VIEPHARMA PHARMACY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('VIKAS PHARMACY Ltd', 'Community', 'pharmacy', 'MUHANGA', -2.0833, 29.7500),
('VINCA PHARMACIE', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('VINE PHARMACY', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY / GACURIRO BRANCH', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY KACYIRU 1', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY KACYIRU 2', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY KACYIRU 3', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY NYARUGUNGA', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('VINE PHARMACY NYARUTARAMA BRANCH', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VINE PHARMACY REMERA 2', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('VISIBLE PHARMACY Ltd', 'Community', 'pharmacy', 'MUSANZE', -1.4989, 29.6336),
('VISION MENIPHAR 2 Ltd PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('VISTA PHARMACY Ltd ZINDIRO BRANCH', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('VITA GRATIA PHARMACY Ltd', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('VITAL Ltd', 'Community', 'pharmacy', 'GICUMBI', -1.4833, 29.8667),
('VIVA PHARMACY BRANCH Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('VIVA PHARMACY Ltd', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('VOX PHARMACY Ltd', 'Community', 'pharmacy', 'KAMONYI', -2.0167, 29.8667),
('WEMA RETAIL PHARMACY', 'Community', 'pharmacy', 'HUYE', -2.6167, 29.7333),
('WESTERN PHARMACY', 'Community', 'pharmacy', 'RUBAVU', -1.4989, 29.2667),
('WESTERN PHARMACY', 'Community', 'pharmacy', 'RUTSIRO', -1.8833, 29.3333),
('YES PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619),
('ZIA PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ZIP PHARMACY', 'Community', 'pharmacy', 'KICUKIRO', -1.9706, 30.1044),
('ZOOM PHARMACY Ltd', 'Community', 'pharmacy', 'GASABO', -1.9441, 30.0619);
