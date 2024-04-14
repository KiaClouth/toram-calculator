"use client";

import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import React, { useState, type CSSProperties, useEffect } from "react";
import Button from "../_components/button";
import { type Condition, type Formula, type Skill, type SkillCost, type SkillEffect, type SkillYield } from "@prisma/client";

interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

interface _Formula extends Formula{
  subFormula1?:_Formula[]
  subFormula2?:_Formula[]
}

interface _SkillCost extends SkillCost{
  costFormula:_Formula
}

interface _SkillYield extends SkillYield{
  yieldFormula:_Formula
}

interface _Condition extends Condition{
  subCondition1?:_Condition[]
  subCondition2?:_Condition[]
}

interface _SkillEffect extends SkillEffect{
  condition:_Condition
  cost:_SkillCost[]
  yield:_SkillYield[]
  
}

interface _Skill extends Skill {
  skillEffect: _SkillEffect[]
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary, session } = props;
  const skillSequence: _Skill[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "冲击波",
      level: 7,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      skillEffect: [
        {
          condition: {
            id: "",
            operand1Type: "MAINWEAPON_TYPE",
            operand2Type: "STAFF",
            operator: "EQUALS",
          },
          cost: [
            {
              costFormula: {
                subFormula1: [],
                subFormula2: [],
                id: "",
                operand1Type: "CONSTANT",
                operand1Multiplier: 300,
                operand2Type: "CONSTANT",
                operand2Multiplier: 0,
                operator: "AND"
              },
              id: "",
              costType: "C_MP",
              skillEffectId: null,
              formulaId: ""
            }
          ],
          yield: [{
            yieldFormula: {
              subFormula1: [{
                id: "",
                operand1Type: "C_VMATK",
                operand1Multiplier: 1,
                operand2Type: "CONSTANT",
                operand2Multiplier: 200,
                operator: "AND"
              }],
              subFormula2: [],
              id: "",
              operand1Type: "CONSTANT",
              operand1Multiplier: 0,
              operand2Type: "CONSTANT",
              operand2Multiplier: 2.5,
              operator: "MULTI"
            },
            id: "",
            triggerTiming: "ON_USE",
            delay: 33,
            yieldType: "M_HP",
            formulaId: "",
            skillEffectId: null,
            durationType: "SKILL",
            durationValue: 1
          }],
          id: "",
          conditionId: "",
          actionBaseDuration: 13,
          actionModifiableDuration: 48,
          castingDurationFormulaId: "",
          belongToskillId: ""
        }
      ],
      createdByUserId: null,
      updatedByUserId: null,
      viewCount: 0,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageTimestamps: [],
      viewTimestamps: []
    }, {
      skillEffect: [],
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "爆能",
      level: 10,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      createdByUserId: null,
      updatedByUserId: null,
      viewCount: 0,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageTimestamps: [],
      viewTimestamps: []
    }
  ]


  useEffect(() => {
    console.log("comboAnalyze");
  }, []);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          className="ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:w-[calc(100dvw-130px)] 2xl:w-[1536px]"
        >
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.monster.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  type="search"
                  placeholder={dictionary.ui.monster.searchPlaceholder}
                  className="w-full flex-1 rounded-sm border-transition-color-20 bg-transition-color-8 px-3 py-2 backdrop-blur-xl placeholder:text-accent-color-50 hover:border-accent-color-70 hover:bg-transition-color-8
                  focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:rounded-none lg:border-b-1.5 lg:bg-transparent lg:px-5 lg:font-normal"
                />
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.monster.discription}
            </div>
            <div></div>
          </div>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>
    </main>
  );
}
