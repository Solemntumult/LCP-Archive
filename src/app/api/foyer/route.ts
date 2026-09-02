import { NextRequest, NextResponse } from 'next/server';
import { getAllPersons } from '@/lib/db';
import {
  getTreeDataFormatted,
  getFullName,
  getSpouses,
  getChildrenBySpouse,
  getChildren,
} from '@/lib/genealogy';
import { FoyerData, FoyerSpouseData, FoyerChildData, FoyerChildrenGroup } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personIdStr = searchParams.get('personId');

    const allPersonsRaw = getAllPersons();
    const allTreeNodes = getTreeDataFormatted(allPersonsRaw);

    // If no personId, find the patriarch (root person)
    let personId: number;
    if (personIdStr) {
      personId = parseInt(personIdStr, 10);
    } else {
      const patriarch = allTreeNodes.find(
        (p) => !p.father_id && !p.mother_id && p.is_blood
      );
      personId = patriarch ? patriarch.id : allTreeNodes[0]?.id ?? 0;
    }

    const person = allTreeNodes.find((p) => p.id === personId);
    if (!person) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    // Get spouses
    const rawPerson = allPersonsRaw.find((p) => p.id === personId);
    const rawSpouses = rawPerson ? getSpouses(personId, allPersonsRaw) : [];

    const spouses: FoyerSpouseData[] = rawSpouses.map((sp) => ({
      id: sp.id,
      name: getFullName(sp),
      first_name: sp.first_name,
      last_name: sp.last_name,
      gender: sp.gender,
      birth_date: sp.birth_date,
      death_date: sp.death_date,
      photo_url: sp.photo || null,
      profession: sp.profession || null,
    }));

    // Get children grouped by spouse
    const rawChildrenGroups = rawPerson
      ? getChildrenBySpouse(personId, allPersonsRaw)
      : [];

    let totalChildrenCount = 0;

    const childrenGroups: FoyerChildrenGroup[] = rawChildrenGroups.map(
      (group) => {
        const spouseData: FoyerSpouseData | null = group.spouse
          ? {
              id: group.spouse.id,
              name: getFullName(group.spouse),
              first_name: group.spouse.first_name,
              last_name: group.spouse.last_name,
              gender: group.spouse.gender,
              birth_date: group.spouse.birth_date,
              death_date: group.spouse.death_date,
              photo_url: group.spouse.photo || null,
              profession: group.spouse.profession || null,
            }
          : null;

        const children: FoyerChildData[] = group.children.map((child) => {
          const childDescendants = getChildren(child.id, allPersonsRaw);
          const hasDescendants = childDescendants.length > 0;

          // Check if partially documented: has spouse_of references but no children listed
          const childSpouses = getSpouses(child.id, allPersonsRaw);
          const isPartiallyDocumented =
            !hasDescendants && childSpouses.length > 0;

          totalChildrenCount++;

          return {
            id: child.id,
            name: getFullName(child),
            first_name: child.first_name,
            last_name: child.last_name,
            gender: child.gender,
            birth_date: child.birth_date,
            death_date: child.death_date,
            photo_url: child.photo || null,
            profession: child.profession || null,
            hasDescendants,
            descendantsCount: childDescendants.length,
            isPartiallyDocumented,
          };
        });

        return { spouse: spouseData, children };
      }
    );

    const foyerData: FoyerData = {
      person,
      spouses,
      childrenGroups,
      totalChildrenCount,
    };

    return NextResponse.json(foyerData);
  } catch (error) {
    console.error('Error fetching foyer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch foyer data' },
      { status: 500 }
    );
  }
}
