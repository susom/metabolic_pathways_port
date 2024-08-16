import {
  compose,
  replace,
  trim,
} from 'ramda';

const cyclePrefix = 'subway_x5F_map_x5F_not_x5F_cycle_x5F_';
const cycleIdSpaceDelimiter = '_x5F_';

const createLayerId =  compose(
  s => `${cyclePrefix}${s}`,
  replace(/\s/g, cycleIdSpaceDelimiter),
  trim,
);

/* aminos */
const cycleAmmoniumCaptureRelease =
  createLayerId('ammonium capture release');

const cycleAromaticAminoAcidMetabolism =
  createLayerId('aromatic amino acid metabolism');

const cycleBranchedChainAminoAcidBreakdown =
  createLayerId('branched chain amino acid breakdown_1_');

const cycleSingleCarbonMetabolism =
  createLayerId('single carbon metabolism');

const cycleUrea =
  createLayerId('urea');

/* carbs */
const cycleGlycogenGalactoseMetabolism =
  createLayerId('glycogen galactose metabolism');

const cycleGlycolysisGluconeogenesis =
  createLayerId('glycolysis gluconeogenesis');

const cyclePentosePhosphatePathway =
  createLayerId('pentose phosphate pathway');

/* heme */
const cycleHemeDegradation =
  createLayerId('heme degradation');

const cycleHemeSynthesis =
  createLayerId('heme synthesis');

/* lipids */
const cycleCholesterolSynthesis =
  createLayerId('cholesterol synthesis');

const cycleFattyAcidOxidation =
  createLayerId('fatty acid oxidation');

const cycleFattyAcidSynthesis =
  createLayerId('fatty acid synthesis');

const cycleKetoneBodyMetabolism =
  createLayerId('ketone body metabolism');

const cycleSteroidHormoneSynthesis =
  createLayerId('steroid hormone synthesis');

/* nucleotides */
const cycleBaseSalvage =
  createLayerId('base salvage');

const cycleDeoxyribonucleotides =
  createLayerId('deoxyribonucleotides');

const cycleNucleosideSalvage =
  createLayerId('nucleoside salvage');

const cycleNucleotideBreakdown =
  createLayerId('nucleotide breakdown');

const cyclePurineSynthesis =
  createLayerId('purine synthesis');

const cyclePyrimidineSynthesis =
  createLayerId('pyrimidine synthesis');

/* oxidative */
const cycleCitricAcid =
  createLayerId('citric acid');

const cycleOxidativePhosphorylation =
  createLayerId('oxidative phosphorylation');

export const cycleCollection = ({
    cycleAmmoniumCaptureRelease,
    cycleAromaticAminoAcidMetabolism,
    cycleBaseSalvage,
    cycleBranchedChainAminoAcidBreakdown,
    cycleCholesterolSynthesis,
    cycleCitricAcid,
    cycleDeoxyribonucleotides,
    cycleFattyAcidOxidation,
    cycleFattyAcidSynthesis,
    cycleGlycogenGalactoseMetabolism,
    cycleGlycolysisGluconeogenesis,
    cycleHemeDegradation,
    cycleHemeSynthesis,
    cycleKetoneBodyMetabolism,
    cycleNucleosideSalvage,
    cycleNucleotideBreakdown,
    cycleOxidativePhosphorylation,
    cyclePentosePhosphatePathway,
    cyclePurineSynthesis,
    cyclePyrimidineSynthesis,
    cycleSingleCarbonMetabolism,
    cycleSteroidHormoneSynthesis,
    cycleUrea,
});

export const cycleNameCollection = ({
    cycleAmmoniumCaptureRelease: 'Ammonium capture and release',
    cycleAromaticAminoAcidMetabolism: 'Aromatic amino acid metabolism',
    cycleBaseSalvage: 'Base salvage',
    cycleBranchedChainAminoAcidBreakdown: 'Branched chain amino acid breakdown',
    cycleCholesterolSynthesis: 'Cholesterol synthesis',
    cycleCitricAcid: 'TCA cycle',
    cycleDeoxyribonucleotides: 'Deoxyribonucleotides',
    cycleFattyAcidOxidation: 'Fatty acid oxidation',
    cycleFattyAcidSynthesis: 'Fatty acid synthesis',
    cycleGlycogenGalactoseMetabolism: 'Glycogen and galactose metabolism',
    cycleGlycolysisGluconeogenesis: 'Glycolysis and Gluconeogenesis',
    cycleHemeDegradation: 'Heme degradation',
    cycleHemeSynthesis: 'Heme synthesis',
    cycleKetoneBodyMetabolism: 'Ketone body metabolism',
    cycleNucleosideSalvage: 'Nucleoside salvage',
    cycleNucleotideBreakdown: 'Nucleotide breakdown',
    cycleOxidativePhosphorylation: 'Oxidative phosphorylation',
    cyclePentosePhosphatePathway: 'Pentose phosphate pathway',
    cyclePurineSynthesis: 'Purine synthesis',
    cyclePyrimidineSynthesis: 'Pyrimidine synthesis',
    cycleSingleCarbonMetabolism: 'Single carbon metabolism',
    cycleSteroidHormoneSynthesis: 'Steroid hormone synthesis',
    cycleUrea: 'Urea cycle',
});

export const neighborhoodCollection = ({
  aminos: 'aminos',
  carbs: 'carbs',
  heme: 'heme',
  lipids: 'lipids',
  nucleotides: 'nucleotides',
  oxidative: 'oxidative',
});

export const neighborhoodCoverCollection = {
  [neighborhoodCollection.aminos]: {
    cycleAmmoniumCaptureRelease,
    cycleAromaticAminoAcidMetabolism,
    cycleBranchedChainAminoAcidBreakdown,
    cycleSingleCarbonMetabolism,
    cycleUrea,
  },
  [neighborhoodCollection.carbs]: {
    cycleGlycogenGalactoseMetabolism,
    cycleGlycolysisGluconeogenesis,
    cyclePentosePhosphatePathway,
  },
  [neighborhoodCollection.heme]: {
    cycleHemeDegradation,
    cycleHemeSynthesis,
  },
  [neighborhoodCollection.lipids]: {
    cycleCholesterolSynthesis,
    cycleFattyAcidOxidation,
    cycleFattyAcidSynthesis,
    cycleKetoneBodyMetabolism,
    cycleSteroidHormoneSynthesis,
  },
  [neighborhoodCollection.nucleotides]: {
    cycleBaseSalvage,
    cycleDeoxyribonucleotides,
    cycleNucleosideSalvage,
    cycleNucleotideBreakdown,
    cyclePurineSynthesis,
    cyclePyrimidineSynthesis,
  },
  [neighborhoodCollection.oxidative]: {
    cycleCitricAcid,
    cycleOxidativePhosphorylation,
  },
};
