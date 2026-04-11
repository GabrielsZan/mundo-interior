import type { ISkill, Domain, ActiveBuffs } from '@/types'

/**
 * Computes all active gameplay buffs from the skill list.
 * Only unlocked skills contribute. Values stack additively.
 */
export function computeActiveBuffs(skills: ISkill[]): ActiveBuffs {
  const buffs: ActiveBuffs = {
    xpDomainPct:     {},
    xpGeneralPct:    0,
    lootRarityShift: 0,
    lootExtraChance: 0,
  }

  for (const skill of skills) {
    if (!skill.isUnlocked) continue
    const { buff } = skill

    switch (buff.type) {
      case 'xp_domain_pct':
        buffs.xpDomainPct[skill.domain] =
          (buffs.xpDomainPct[skill.domain] ?? 0) + buff.value
        break
      case 'xp_general_pct':
        buffs.xpGeneralPct += buff.value
        break
      case 'loot_rarity_shift':
        buffs.lootRarityShift += buff.value
        break
      case 'loot_extra_chance':
        buffs.lootExtraChance += buff.value
        break
    }
  }

  return buffs
}

/**
 * Applies XP buffs to a base XP gain, returning boosted values.
 */
export function applyXPBuffs(
  base: { xpGeneral: number; xpDomain: number },
  buffs: ActiveBuffs,
  missionDomain: Domain
): { xpGeneral: number; xpDomain: number } {
  const generalMultiplier = 1 + buffs.xpGeneralPct / 100
  const domainMultiplier  = 1 + (buffs.xpDomainPct[missionDomain] ?? 0) / 100

  return {
    xpGeneral: Math.round(base.xpGeneral * generalMultiplier),
    xpDomain:  Math.round(base.xpDomain  * domainMultiplier),
  }
}
