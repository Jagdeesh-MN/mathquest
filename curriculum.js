/* curriculum.js — Complete Grade 5 & 6 skill trees */
"use strict";

const CURRICULUM = {
  5: [
    {
      id: "G5-NBT",
      name: "Number & Operations in Base Ten",
      icon: "🔢",
      standard: "CC.2.1.5.B",
      skills: [
        { id:"5-A.1",  name:"Convert between standard and expanded form",                  type:"input"  },
        { id:"5-A.2",  name:"Place value",                                                  type:"mc"     },
        { id:"5-C.1",  name:"Understanding powers of ten",                                  type:"mc"     },
        { id:"5-C.2",  name:"Evaluate powers of ten",                                       type:"input"  },
        { id:"5-C.3",  name:"Write powers of ten with exponents",                           type:"input"  },
        { id:"5-D.4",  name:"Multiply a whole number by a power of ten",                    type:"input"  },
        { id:"5-W.1",  name:"What decimal number is illustrated?",                          type:"visual" },
        { id:"5-W.3",  name:"Understanding decimals expressed in words",                    type:"mc"     },
        { id:"5-W.4",  name:"Place values in decimal numbers",                              type:"mc"     },
        { id:"5-W.5",  name:"Relationship between decimal place values",                    type:"mc"     },
        { id:"5-W.6",  name:"Convert decimals: standard and expanded form",                 type:"input"  },
        { id:"5-W.7",  name:"Convert decimals: standard and expanded form using fractions", type:"input"  },
        { id:"5-W.8",  name:"Compose and decompose decimals in multiple ways",              type:"drag"   },
        { id:"5-W.9",  name:"Round decimals",                                               type:"input"  },
        { id:"5-X.2",  name:"Compare decimals using grids",                                 type:"visual" },
        { id:"5-X.3",  name:"Compare decimals on number lines",                             type:"visual" },
        { id:"5-X.4",  name:"Compare decimal numbers",                                      type:"mc"     },
        { id:"5-AA.13",name:"Estimate sums and differences of decimals using rounding",     type:"input"  },
        { id:"5-BB.1", name:"Multiply a decimal by a power of ten",                         type:"input"  },
        { id:"5-BB.4", name:"Multiply by a power of ten: find the missing number",          type:"input"  },
        { id:"5-EE.1", name:"Divide by powers of ten",                                      type:"input"  },
        { id:"5-EE.2", name:"Decimal division patterns over increasing place values",       type:"mc"     },
        { id:"5-EE.5", name:"Divide by a power of ten: find the missing number",            type:"input"  },
      ]
    },
    {
      id: "G5-OPS",
      name: "Operations with Whole Numbers & Decimals",
      icon: "➕",
      standard: "CC.2.1.5.B.2",
      skills: [
        { id:"5-D.9",  name:"Multiply by 2-digit numbers: complete the missing steps",      type:"input"  },
        { id:"5-D.10", name:"Multiply 2-digit numbers by 2-digit numbers",                  type:"input"  },
        { id:"5-D.11", name:"Multiply 2-digit numbers by 3-digit numbers",                  type:"input"  },
        { id:"5-D.12", name:"Multiply 2-digit numbers by larger numbers",                   type:"input"  },
        { id:"5-D.13", name:"Multiply by 2-digit numbers: word problems",                   type:"word"   },
        { id:"5-D.14", name:"Multiply by 3-digit numbers",                                  type:"input"  },
        { id:"5-E.9",  name:"Divide by 2-digit numbers: estimate and adjust",               type:"input"  },
        { id:"5-E.10", name:"Divide by 2-digit numbers using models",                       type:"visual" },
        { id:"5-E.11", name:"Divide by 2-digit numbers using partial quotients",            type:"input"  },
        { id:"5-E.12", name:"Divide 2 and 3-digit numbers by 2-digit numbers",              type:"input"  },
        { id:"5-E.13", name:"Divide 2 and 3-digit by 2-digit: word problems",               type:"word"   },
        { id:"5-E.14", name:"Divide 4-digit numbers by 2-digit numbers",                    type:"input"  },
        { id:"5-E.15", name:"Divide 4-digit by 2-digit: word problems",                     type:"word"   },
        { id:"5-AA.1", name:"Add decimal numbers using blocks",                             type:"visual" },
        { id:"5-AA.2", name:"Add decimal numbers",                                          type:"input"  },
        { id:"5-AA.3", name:"Use properties to add three decimals",                         type:"input"  },
        { id:"5-AA.5", name:"Subtract decimal numbers",                                     type:"input"  },
        { id:"5-AA.6", name:"Add and subtract decimal numbers",                             type:"input"  },
        { id:"5-AA.7", name:"Use compensation to add and subtract decimals",                type:"mc"     },
        { id:"5-AA.8", name:"Add and subtract decimals: word problems",                     type:"word"   },
        { id:"5-AA.9", name:"Choose decimals with a particular sum or difference",          type:"mc"     },
        { id:"5-AA.10",name:"Complete the decimal addition or subtraction sentence",        type:"input"  },
        { id:"5-AA.11",name:"Compare sums and differences of decimals",                     type:"mc"     },
        { id:"5-BB.3", name:"Multiply by 0.1 or 0.01",                                     type:"input"  },
        { id:"5-CC.2", name:"Multiply a decimal by a one-digit whole number: tenths",       type:"input"  },
        { id:"5-CC.3", name:"Multiply a decimal by a one-digit whole number using blocks",  type:"visual" },
        { id:"5-CC.4", name:"Multiply a decimal using the distributive property",           type:"input"  },
        { id:"5-CC.5", name:"Multiply a decimal by a one-digit whole number",               type:"input"  },
        { id:"5-CC.6", name:"Multiply a decimal by two-digit using area models",            type:"visual" },
        { id:"5-CC.7", name:"Multiply a decimal by a multi-digit whole number",             type:"input"  },
        { id:"5-CC.8", name:"Multiply decimals and whole numbers: word problems",           type:"word"   },
        { id:"5-CC.9", name:"Multiply three or more numbers, one of which is a decimal",   type:"input"  },
        { id:"5-DD.1", name:"Estimate products of decimals",                                type:"input"  },
        { id:"5-DD.4", name:"Multiply two decimals: where does the decimal point go?",      type:"drag"   },
        { id:"5-DD.6", name:"Multiply two decimals: products up to hundredths",             type:"input"  },
        { id:"5-EE.6", name:"Divide by 0.1 or 0.01",                                       type:"input"  },
        { id:"5-FF.4", name:"Divide decimals by whole numbers using place value",           type:"input"  },
        { id:"5-FF.5", name:"Divide decimals by whole numbers without adding zeros",        type:"input"  },
        { id:"5-FF.6", name:"Division with decimal quotients",                              type:"input"  },
        { id:"5-FF.7", name:"Division with decimal quotients and rounding",                 type:"input"  },
        { id:"5-FF.8", name:"Division with decimal quotients: word problems",               type:"word"   },
        { id:"5-FF.9", name:"Divide by decimals using place value",                         type:"input"  },
        { id:"5-GG.1", name:"Add, subtract, multiply, and divide decimals",                 type:"input"  },
        { id:"5-GG.2", name:"Operations with decimals: word problems",                      type:"word"   },
        { id:"5-GG.3", name:"Decimals: multi-step word problems",                           type:"word"   },
        { id:"5-HH.1", name:"Add and subtract money amounts",                               type:"input"  },
        { id:"5-HH.2", name:"Add and subtract money: word problems",                        type:"word"   },
        { id:"5-HH.5", name:"Multiply money amounts: word problems",                        type:"word"   },
        { id:"5-HH.8", name:"Divide money amounts: word problems",                          type:"word"   },
      ]
    },
    {
      id: "G5-FRAC",
      name: "Fractions",
      icon: "½",
      standard: "CC.2.1.5.C",
      skills: [
        { id:"5-L.2",  name:"Add fractions with unlike denominators using models",          type:"visual" },
        { id:"5-L.3",  name:"Add fractions with unlike denominators",                       type:"input"  },
        { id:"5-L.4",  name:"Subtract fractions with unlike denominators using models",     type:"visual" },
        { id:"5-L.5",  name:"Subtract fractions with unlike denominators",                  type:"input"  },
        { id:"5-L.7",  name:"Add and subtract fractions: word problems",                    type:"word"   },
        { id:"5-L.8",  name:"Add 3 or more fractions with unlike denominators",             type:"input"  },
        { id:"5-M.7",  name:"Add and subtract fractions and mixed numbers in recipes",      type:"word"   },
        { id:"5-M.8",  name:"Add and subtract fractions: multi-step word problems",         type:"word"   },
        { id:"5-N.7",  name:"Multiply two unit fractions using models",                     type:"visual" },
        { id:"5-N.8",  name:"Multiply two fractions using models",                          type:"visual" },
        { id:"5-N.9",  name:"Multiply fractions greater than one using models",             type:"visual" },
        { id:"5-O.5",  name:"Fractions of a number I",                                      type:"input"  },
        { id:"5-O.6",  name:"Fractions of a number: word problems",                         type:"word"   },
        { id:"5-O.7",  name:"Fractions of a number II",                                     type:"input"  },
        { id:"5-P.1",  name:"Multiply two fractions",                                       type:"input"  },
        { id:"5-P.2",  name:"Multiply two fractions: word problems",                        type:"word"   },
        { id:"5-P.3",  name:"Multiply three fractions and whole numbers",                   type:"input"  },
        { id:"5-P.4",  name:"Complete the fraction multiplication sentence",                type:"input"  },
        { id:"5-Q.3",  name:"Multiply with mixed numbers using area models",                type:"visual" },
        { id:"5-R.2",  name:"Multiply a mixed number by a whole number",                    type:"input"  },
        { id:"5-R.3",  name:"Multiply a mixed number by a fraction",                        type:"input"  },
        { id:"5-R.4",  name:"Multiply two mixed numbers",                                   type:"input"  },
        { id:"5-R.7",  name:"Multiplication with mixed numbers: word problems",             type:"word"   },
        { id:"5-R.8",  name:"Multiply fractions and mixed numbers in recipes",              type:"word"   },
        { id:"5-R.9",  name:"Multiply fractions and mixed numbers: multi-step word problems",type:"word" },
        { id:"5-S.1",  name:"Scaling whole numbers by fractions: justify your answer",     type:"mc"     },
        { id:"5-S.2",  name:"Scaling whole numbers by fractions",                           type:"mc"     },
        { id:"5-S.3",  name:"Scaling fractions by fractions",                               type:"mc"     },
        { id:"5-S.4",  name:"Scaling mixed numbers by fractions",                           type:"mc"     },
        { id:"5-T.2",  name:"Understand fractions as division: word problems",              type:"word"   },
        { id:"5-T.5",  name:"Divide whole numbers by unit fractions using models",          type:"visual" },
        { id:"5-T.7",  name:"Divide unit fractions and whole numbers using area models",    type:"visual" },
        { id:"5-T.8",  name:"Divide unit fractions and whole numbers using number lines",   type:"visual" },
        { id:"5-U.1",  name:"Divide unit fractions by whole numbers",                       type:"input"  },
        { id:"5-U.2",  name:"Divide whole numbers by unit fractions",                       type:"input"  },
        { id:"5-U.4",  name:"Divide unit fractions and whole numbers: word problems",       type:"word"   },
        { id:"5-V.3",  name:"Multi-step word problems with fractions and mixed numbers",    type:"word"   },
        { id:"5-TT.2", name:"Area of rectangles with fractions",                            type:"input"  },
      ]
    },
    {
      id: "G5-ALG",
      name: "Algebraic Thinking",
      icon: "🔣",
      standard: "CC.2.2.5.A",
      skills: [
        { id:"5-H.1",  name:"Write numerical expressions: one operation",                   type:"input"  },
        { id:"5-H.2",  name:"Write numerical expressions: two operations",                  type:"input"  },
        { id:"5-H.3",  name:"Evaluate numerical expressions",                               type:"input"  },
        { id:"5-H.4",  name:"Evaluate numerical expressions with parentheses",              type:"input"  },
        { id:"5-H.5",  name:"Evaluate numerical expressions with parentheses and brackets", type:"input"  },
        { id:"5-H.6",  name:"Identify mistakes involving the order of operations",          type:"mc"     },
        { id:"5-H.7",  name:"Evaluate numerical expressions: parentheses in different places",type:"mc"  },
        { id:"5-H.9",  name:"Numerical operations: find the missing sign",                  type:"drag"   },
        { id:"5-H.10", name:"Comparison statements with numerical expressions",             type:"mc"     },
        { id:"5-GG.4", name:"Equations with mixed operations: true or false",               type:"mc"     },
        { id:"5-KK.1", name:"Use a rule to complete a number pattern",                      type:"input"  },
        { id:"5-KK.2", name:"Compare patterns",                                             type:"mc"     },
        { id:"5-KK.3", name:"Complete an increasing number pattern",                        type:"input"  },
        { id:"5-KK.4", name:"Complete a multiplication number pattern",                     type:"input"  },
        { id:"5-KK.5", name:"Number patterns: word problems",                               type:"word"   },
        { id:"5-KK.6", name:"Number patterns: mixed review",                                type:"mc"     },
      ]
    },
    {
      id: "G5-GEO",
      name: "Geometry",
      icon: "📐",
      standard: "CC.2.3.5.A",
      skills: [
        { id:"5-LL.1", name:"Describe the coordinate plane",                                type:"mc"     },
        { id:"5-LL.2", name:"Objects on a coordinate plane",                                type:"visual" },
        { id:"5-LL.3", name:"Graph points on a coordinate plane",                           type:"visual" },
        { id:"5-LL.5", name:"Graph points from a table",                                    type:"visual" },
        { id:"5-LL.8", name:"Coordinate planes as maps",                                    type:"visual" },
        { id:"5-LL.9", name:"Follow directions on a coordinate plane",                      type:"visual" },
        { id:"5-PP.3", name:"Classify triangles",                                           type:"mc"     },
        { id:"5-QQ.1", name:"Parallel sides in quadrilaterals",                             type:"mc"     },
        { id:"5-QQ.2", name:"Identify parallelograms",                                      type:"mc"     },
        { id:"5-QQ.3", name:"Identify trapezoids",                                          type:"mc"     },
        { id:"5-QQ.4", name:"Identify rectangles",                                          type:"mc"     },
        { id:"5-QQ.5", name:"Identify rhombuses",                                           type:"mc"     },
        { id:"5-QQ.6", name:"Classify quadrilaterals",                                      type:"mc"     },
        { id:"5-QQ.9", name:"Identify relationships between quadrilaterals",                type:"mc"     },
        { id:"5-RR.1", name:"Is it a polygon?",                                             type:"mc"     },
        { id:"5-RR.2", name:"Number of sides in polygons",                                  type:"input"  },
        { id:"5-RR.3", name:"Regular and irregular polygons",                               type:"mc"     },
      ]
    },
    {
      id: "G5-MEAS",
      name: "Measurement, Data & Probability",
      icon: "📏",
      standard: "CC.2.4.5.A",
      skills: [
        { id:"5-II.1", name:"Compare and convert customary units of length",                type:"mc"     },
        { id:"5-II.2", name:"Compare and convert customary units of weight",                type:"mc"     },
        { id:"5-II.3", name:"Compare and convert customary units of volume",                type:"mc"     },
        { id:"5-II.4", name:"Compare and convert customary units",                          type:"mc"     },
        { id:"5-II.5", name:"Conversion tables — customary units",                          type:"input"  },
        { id:"5-II.6", name:"Compare customary units by multiplying",                       type:"input"  },
        { id:"5-II.7", name:"Convert customary units involving fractions",                  type:"input"  },
        { id:"5-II.8", name:"Convert mixed customary units",                                type:"input"  },
        { id:"5-II.9", name:"Add and subtract mixed customary units",                       type:"input"  },
        { id:"5-II.10",name:"Multi-step problems with customary unit conversions",          type:"word"   },
        { id:"5-JJ.1", name:"Compare and convert metric units of length",                   type:"mc"     },
        { id:"5-JJ.2", name:"Compare and convert metric units of mass",                     type:"mc"     },
        { id:"5-JJ.3", name:"Compare and convert metric units of volume",                   type:"mc"     },
        { id:"5-JJ.4", name:"Compare and convert metric units",                             type:"mc"     },
        { id:"5-JJ.5", name:"Conversion tables — metric units",                             type:"input"  },
        { id:"5-JJ.7", name:"Add and subtract metric mixed units",                          type:"input"  },
        { id:"5-JJ.8", name:"Multi-step problems with metric unit conversions",             type:"word"   },
        { id:"5-JJ.9", name:"Multi-step: customary or metric conversions",                  type:"word"   },
        { id:"5-NN.1", name:"Interpret line plots with whole numbers",                      type:"visual" },
        { id:"5-NN.2", name:"Create line plots with decimals",                              type:"visual" },
        { id:"5-NN.3", name:"Create line plots with fractions",                             type:"visual" },
        { id:"5-NN.4", name:"Create and interpret line plots with fractions",               type:"visual" },
        { id:"5-NN.5", name:"Interpret line plots with fractions: multi-step problems",     type:"word"   },
        { id:"5-NN.6", name:"Create line graphs",                                           type:"visual" },
        { id:"5-NN.7", name:"Interpret line graphs",                                        type:"mc"     },
        { id:"5-NN.8", name:"Create bar graphs",                                            type:"visual" },
        { id:"5-NN.9", name:"Interpret bar graphs",                                         type:"mc"     },
        { id:"5-NN.12",name:"Interpret frequency tables: one-step problems",                type:"mc"     },
        { id:"5-UU.1", name:"Volume of irregular figures made of unit cubes",               type:"input"  },
        { id:"5-UU.2", name:"Volume of rectangular prisms: expressions",                    type:"input"  },
        { id:"5-UU.3", name:"Volume of rectangular prisms made of unit cubes",              type:"visual" },
        { id:"5-UU.5", name:"Volume of cubes and rectangular prisms",                       type:"input"  },
        { id:"5-UU.6", name:"Volume of cubes and rectangular prisms: word problems",        type:"word"   },
        { id:"5-UU.8", name:"Volume: multi-step word problems",                             type:"word"   },
        { id:"5-UU.9", name:"Volume of compound figures",                                   type:"input"  },
      ]
    },
  ],

  6: [
    {
      id: "G6-RP",
      name: "Ratios & Proportional Relationships",
      icon: "⚖️",
      standard: "CC.2.1.6.D",
      skills: [
        { id:"6-A.1",  name:"Write a ratio",                                                type:"input"  },
        { id:"6-A.2",  name:"Write a ratio: word problems",                                 type:"word"   },
        { id:"6-A.3",  name:"Identify equivalent ratios",                                   type:"mc"     },
        { id:"6-A.4",  name:"Write an equivalent ratio",                                    type:"input"  },
        { id:"6-A.5",  name:"Equivalent ratios: word problems",                             type:"word"   },
        { id:"6-A.6",  name:"Unit rates",                                                   type:"input"  },
        { id:"6-A.7",  name:"Unit rates: word problems",                                    type:"word"   },
        { id:"6-A.8",  name:"Compare ratios: word problems",                                type:"word"   },
        { id:"6-B.1",  name:"Do the ratios form a proportion?",                             type:"mc"     },
        { id:"6-B.2",  name:"Solve proportions",                                            type:"input"  },
        { id:"6-B.3",  name:"Solve proportions: word problems",                             type:"word"   },
        { id:"6-C.1",  name:"Convert between percents, fractions, and decimals",            type:"mc"     },
        { id:"6-C.2",  name:"Find what percent one number is of another",                   type:"input"  },
        { id:"6-C.3",  name:"Find a percentage of a number",                                type:"input"  },
        { id:"6-C.4",  name:"Find a percentage of a number: word problems",                 type:"word"   },
        { id:"6-C.5",  name:"Percent of change",                                            type:"input"  },
        { id:"6-C.6",  name:"Percent of change: word problems",                             type:"word"   },
      ]
    },
    {
      id: "G6-NS",
      name: "The Number System",
      icon: "🔢",
      standard: "CC.2.1.6.E",
      skills: [
        { id:"6-D.1",  name:"Divide fractions by whole numbers",                            type:"input"  },
        { id:"6-D.2",  name:"Divide whole numbers by fractions",                            type:"input"  },
        { id:"6-D.3",  name:"Divide fractions",                                             type:"input"  },
        { id:"6-D.4",  name:"Divide fractions: word problems",                              type:"word"   },
        { id:"6-D.5",  name:"Divide mixed numbers",                                         type:"input"  },
        { id:"6-D.6",  name:"Divide mixed numbers: word problems",                          type:"word"   },
        { id:"6-E.1",  name:"Add and subtract integers",                                    type:"input"  },
        { id:"6-E.2",  name:"Add and subtract integers: word problems",                     type:"word"   },
        { id:"6-E.3",  name:"Multiply and divide integers",                                 type:"input"  },
        { id:"6-E.4",  name:"Multiply and divide integers: word problems",                  type:"word"   },
        { id:"6-F.1",  name:"Absolute value and opposite integers",                         type:"input"  },
        { id:"6-F.2",  name:"Compare and order integers",                                   type:"mc"     },
        { id:"6-F.3",  name:"Integers on number lines",                                     type:"visual" },
        { id:"6-G.1",  name:"Understanding the coordinate plane",                           type:"mc"     },
        { id:"6-G.2",  name:"Graph points on all four quadrants",                           type:"visual" },
        { id:"6-G.3",  name:"Distance between two points",                                  type:"input"  },
        { id:"6-H.1",  name:"Greatest common factor",                                       type:"input"  },
        { id:"6-H.2",  name:"Least common multiple",                                        type:"input"  },
        { id:"6-H.3",  name:"GCF and LCM: word problems",                                   type:"word"   },
      ]
    },
    {
      id: "G6-EE",
      name: "Expressions & Equations",
      icon: "🔣",
      standard: "CC.2.2.6.B",
      skills: [
        { id:"6-I.1",  name:"Write variable expressions",                                   type:"input"  },
        { id:"6-I.2",  name:"Evaluate variable expressions with whole numbers",             type:"input"  },
        { id:"6-I.3",  name:"Evaluate variable expressions with decimals and fractions",    type:"input"  },
        { id:"6-I.4",  name:"Write variable expressions from words",                        type:"input"  },
        { id:"6-J.1",  name:"Identify equivalent linear expressions",                       type:"mc"     },
        { id:"6-J.2",  name:"Combine like terms",                                           type:"input"  },
        { id:"6-J.3",  name:"Write equivalent expressions using the distributive property", type:"input"  },
        { id:"6-K.1",  name:"Which x satisfies an equation?",                               type:"mc"     },
        { id:"6-K.2",  name:"Solve one-step equations with whole numbers",                  type:"input"  },
        { id:"6-K.3",  name:"Solve one-step equations with decimals and fractions",         type:"input"  },
        { id:"6-K.4",  name:"Solve one-step equations: word problems",                      type:"word"   },
        { id:"6-K.5",  name:"Solve two-step equations",                                     type:"input"  },
        { id:"6-K.6",  name:"Solve two-step equations: word problems",                      type:"word"   },
        { id:"6-L.1",  name:"Write inequalities from number lines",                         type:"input"  },
        { id:"6-L.2",  name:"Graph inequalities on number lines",                           type:"visual" },
        { id:"6-L.3",  name:"Solve one-step inequalities",                                  type:"input"  },
        { id:"6-L.4",  name:"Solve one-step inequalities: word problems",                   type:"word"   },
        { id:"6-M.1",  name:"Identify independent and dependent variables",                 type:"mc"     },
        { id:"6-M.2",  name:"Write equations for relationships",                            type:"input"  },
        { id:"6-M.3",  name:"Identify relationships from graphs",                           type:"mc"     },
      ]
    },
    {
      id: "G6-GEO",
      name: "Geometry",
      icon: "📐",
      standard: "CC.2.3.6.A",
      skills: [
        { id:"6-N.1",  name:"Area of triangles",                                            type:"input"  },
        { id:"6-N.2",  name:"Area of quadrilaterals",                                       type:"input"  },
        { id:"6-N.3",  name:"Area of compound figures",                                     type:"input"  },
        { id:"6-N.4",  name:"Area and perimeter: word problems",                            type:"word"   },
        { id:"6-O.1",  name:"Surface area of prisms",                                       type:"input"  },
        { id:"6-O.2",  name:"Surface area of pyramids",                                     type:"input"  },
        { id:"6-O.3",  name:"Volume of rectangular prisms",                                 type:"input"  },
        { id:"6-O.4",  name:"Volume and surface area: word problems",                       type:"word"   },
        { id:"6-P.1",  name:"Polygons in the coordinate plane: find the length of a side",  type:"input"  },
        { id:"6-P.2",  name:"Polygons in the coordinate plane: find the perimeter or area", type:"input"  },
      ]
    },
    {
      id: "G6-STAT",
      name: "Statistics & Probability",
      icon: "📊",
      standard: "CC.2.4.6.B",
      skills: [
        { id:"6-Q.1",  name:"Calculate mean, median, mode, and range",                      type:"input"  },
        { id:"6-Q.2",  name:"Mean, median, mode, and range: word problems",                 type:"word"   },
        { id:"6-Q.3",  name:"Changes in mean, median, mode, and range",                     type:"mc"     },
        { id:"6-R.1",  name:"Interpret histograms",                                         type:"mc"     },
        { id:"6-R.2",  name:"Create histograms",                                            type:"visual" },
        { id:"6-R.3",  name:"Interpret box-and-whisker plots",                              type:"mc"     },
        { id:"6-R.4",  name:"Interpret stem-and-leaf plots",                                type:"mc"     },
        { id:"6-R.5",  name:"Interpret dot plots",                                          type:"mc"     },
        { id:"6-S.1",  name:"Calculate mean absolute deviation (MAD)",                      type:"input"  },
        { id:"6-S.2",  name:"Describe distributions",                                       type:"mc"     },
      ]
    },
  ]
};

/* Lesson content (instructional mini-lessons before practice) */
const LESSONS = {
  /* Grade 5 */
  "5-A.1": {
    title: "Standard & Expanded Form",
    body: `<h3>What is Expanded Form?</h3>
<p>Expanded form breaks a number into the value of each digit.</p>
<div class="lesson-example">
  <p><strong>Standard:</strong> 47,356</p>
  <p><strong>Expanded:</strong> 40,000 + 7,000 + 300 + 50 + 6</p>
  <p>Each digit shows its <em>place value</em>!</p>
</div>
<div class="tip">💡 Tip: Zeros are not written in expanded form (they add nothing).</div>`
  },
  "5-A.2": {
    title: "Place Value",
    body: `<h3>Place Value Chart</h3>
<p>Every digit has a place. The place tells you its value.</p>
<div class="lesson-example">
  <p>In <strong>52,748</strong>:</p>
  <p>5 → Ten-thousands (50,000)</p>
  <p>2 → Thousands (2,000)</p>
  <p>7 → Hundreds (700)</p>
  <p>4 → Tens (40)</p>
  <p>8 → Ones (8)</p>
</div>
<div class="tip">💡 Move one place left → value × 10. Move right → value ÷ 10.</div>`
  },
  "5-W.9": {
    title: "Rounding Decimals",
    body: `<h3>How to Round Decimals</h3>
<p>Look at the digit <strong>one place to the right</strong> of where you're rounding.</p>
<div class="lesson-example">
  <p>Round <strong>3.748</strong> to the nearest tenth:</p>
  <p>Look at the hundredths digit: <strong>4</strong> (less than 5)</p>
  <p>→ Round down: <strong>3.7</strong></p>
</div>
<div class="lesson-example">
  <p>Round <strong>3.758</strong> to the nearest tenth:</p>
  <p>Look at the hundredths digit: <strong>5</strong> (5 or more)</p>
  <p>→ Round up: <strong>3.8</strong></p>
</div>
<div class="tip">💡 Remember: 5 or more → round up. 4 or less → round down.</div>`
  },
  "5-H.4": {
    title: "Order of Operations (PEMDAS)",
    body: `<h3>PEMDAS</h3>
<p>Always solve in this order:</p>
<div class="lesson-example">
  <p><strong>P</strong>arentheses first</p>
  <p><strong>E</strong>xponents next</p>
  <p><strong>M</strong>ultiplication &amp; <strong>D</strong>ivision (left to right)</p>
  <p><strong>A</strong>ddition &amp; <strong>S</strong>ubtraction (left to right)</p>
</div>
<div class="lesson-example">
  <p>Solve: <strong>(3 + 4) × 2 − 5</strong></p>
  <p>Step 1: (3 + 4) = 7</p>
  <p>Step 2: 7 × 2 = 14</p>
  <p>Step 3: 14 − 5 = <strong>9</strong></p>
</div>
<div class="tip">💡 "Please Excuse My Dear Aunt Sally" — a classic memory trick!</div>`
  },
  "5-L.3": {
    title: "Adding Fractions with Unlike Denominators",
    body: `<h3>Find a Common Denominator</h3>
<p>Before adding fractions, the denominators must be the same.</p>
<div class="lesson-example">
  <p>Add: <strong>1/3 + 1/4</strong></p>
  <p>LCM of 3 and 4 = <strong>12</strong></p>
  <p>1/3 = 4/12 &nbsp;&nbsp; 1/4 = 3/12</p>
  <p>4/12 + 3/12 = <strong>7/12</strong></p>
</div>
<div class="tip">💡 Always simplify your answer if you can!</div>`
  },
  "5-P.1": {
    title: "Multiplying Fractions",
    body: `<h3>Multiply Across</h3>
<p>To multiply fractions: multiply the numerators, then the denominators.</p>
<div class="lesson-example">
  <p><strong>2/3 × 3/5</strong></p>
  <p>Numerators: 2 × 3 = 6</p>
  <p>Denominators: 3 × 5 = 15</p>
  <p>Answer: 6/15 = <strong>2/5</strong> (simplified)</p>
</div>
<div class="tip">💡 Simplify before multiplying to keep numbers small!</div>`
  },
  "5-U.1": {
    title: "Dividing Unit Fractions",
    body: `<h3>Divide by Flipping!</h3>
<p>To divide a fraction, multiply by its <strong>reciprocal</strong> (flip it).</p>
<div class="lesson-example">
  <p><strong>1/3 ÷ 4</strong></p>
  <p>= 1/3 × 1/4 = <strong>1/12</strong></p>
</div>
<div class="lesson-example">
  <p><strong>6 ÷ 1/3</strong></p>
  <p>= 6 × 3/1 = <strong>18</strong></p>
</div>
<div class="tip">💡 Keep the first number. Change ÷ to ×. Flip the second!</div>`
  },
  /* Grade 6 */
  "6-A.1": {
    title: "Understanding Ratios",
    body: `<h3>What is a Ratio?</h3>
<p>A ratio compares two quantities. It can be written 3 ways:</p>
<div class="lesson-example">
  <p>3 to 5 &nbsp;&nbsp; 3:5 &nbsp;&nbsp; 3/5</p>
</div>
<div class="lesson-example">
  <p>In a bag with 3 red and 5 blue marbles:</p>
  <p>Red to Blue = <strong>3:5</strong></p>
  <p>Blue to Total = <strong>5:8</strong></p>
</div>
<div class="tip">💡 Order matters! Red:Blue is different from Blue:Red.</div>`
  },
  "6-E.1": {
    title: "Adding & Subtracting Integers",
    body: `<h3>Positive and Negative Numbers</h3>
<p>Think of a number line. Moving right = positive. Moving left = negative.</p>
<div class="lesson-example">
  <p><strong>3 + (−5)</strong> = start at 3, move 5 left = <strong>−2</strong></p>
  <p><strong>−4 − (−2)</strong> = −4 + 2 = <strong>−2</strong></p>
</div>
<div class="tip">💡 Subtracting a negative = adding a positive!</div>`
  },
  "6-K.2": {
    title: "Solving One-Step Equations",
    body: `<h3>Balance the Scale</h3>
<p>Whatever you do to one side, do to the other.</p>
<div class="lesson-example">
  <p>Solve: <strong>x + 7 = 15</strong></p>
  <p>Subtract 7 from both sides:</p>
  <p>x = 15 − 7 = <strong>8</strong></p>
</div>
<div class="lesson-example">
  <p>Solve: <strong>3x = 21</strong></p>
  <p>Divide both sides by 3:</p>
  <p>x = 21 ÷ 3 = <strong>7</strong></p>
</div>
<div class="tip">💡 Check: plug your answer back in to verify!</div>`
  },
  "6-Q.1": {
    title: "Mean, Median, Mode & Range",
    body: `<h3>The Four Measures</h3>
<div class="lesson-example">
  <p>Data set: <strong>4, 7, 2, 7, 10</strong></p>
  <p><strong>Mean</strong>: (4+7+2+7+10) ÷ 5 = 30 ÷ 5 = <strong>6</strong></p>
  <p><strong>Median</strong>: Sort → 2, 4, 7, 7, 10 → middle = <strong>7</strong></p>
  <p><strong>Mode</strong>: Most frequent = <strong>7</strong></p>
  <p><strong>Range</strong>: 10 − 2 = <strong>8</strong></p>
</div>
<div class="tip">💡 Mean = average. Median = middle. Mode = most. Range = spread.</div>`
  },
};

/* Achievement definitions */
const ACHIEVEMENTS = [
  { id:"first_correct",  name:"First Star!",        desc:"Get your first correct answer",   icon:"⭐", xp:10  },
  { id:"streak_3",       name:"On a Roll",           desc:"Answer 3 in a row correctly",     icon:"🔥", xp:20  },
  { id:"streak_10",      name:"Hot Streak",          desc:"Answer 10 in a row correctly",    icon:"🚀", xp:50  },
  { id:"skill_done",     name:"Skill Cleared",       desc:"Complete a full skill session",   icon:"✅", xp:30  },
  { id:"domain_done",    name:"Domain Master",       desc:"Complete all skills in a domain", icon:"🏆", xp:100 },
  { id:"day_streak_3",   name:"3-Day Streak",        desc:"Practice 3 days in a row",        icon:"📅", xp:40  },
  { id:"day_streak_7",   name:"Week Warrior",        desc:"Practice 7 days in a row",        icon:"🗓️", xp:80  },
  { id:"perfect_score",  name:"Perfect Score",       desc:"Score 100% on a skill",           icon:"💯", xp:60  },
  { id:"xp_100",         name:"XP Collector",        desc:"Earn 100 total XP",               icon:"💎", xp:20  },
  { id:"xp_500",         name:"XP Hoarder",          desc:"Earn 500 total XP",               icon:"👑", xp:50  },
  { id:"g5_started",     name:"Grade 5 Explorer",    desc:"Start a Grade 5 skill",           icon:"5️⃣", xp:10  },
  { id:"g6_started",     name:"Grade 6 Explorer",    desc:"Start a Grade 6 skill",           icon:"6️⃣", xp:10  },
];
