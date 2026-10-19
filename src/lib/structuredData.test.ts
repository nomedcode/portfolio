import { describe, expect, test } from "vitest";
import { credlyBadge, education, profile, skillCategories } from "./content";
import { siteUrl } from "./siteMetadata";
import { personId, structuredData, websiteId } from "./structuredData";

type Node = Record<string, unknown>;

const graph = structuredData()["@graph"] as Node[];
const node = (type: string) => graph.find((n) => n["@type"] === type) as Node;

describe("structured data", () => {
  test("declares schema.org and a graph", () => {
    expect(structuredData()["@context"]).toBe("https://schema.org");
    expect(Array.isArray(graph)).toBe(true);
  });

  test("describes the person with the facts the page actually shows", () => {
    const person = node("Person");
    expect(person["@id"]).toBe(personId);
    expect(person.name).toBe(profile.fullName);
    expect(person.alternateName).toBe(profile.name);
    expect(person.url).toBe(`${siteUrl}/`);
    expect(person.jobTitle).toBe("Cloud Engineering Student");
    expect(String(person.description)).toContain("BINUS");

    const university = education[0];
    expect(person.alumniOf).toMatchObject({
      "@type": "CollegeOrUniversity",
      name: university.school,
    });
    expect(person.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "Bandung",
      addressCountry: "ID",
    });
  });

  test("links the same profiles the page links", () => {
    const person = node("Person");
    expect(person.sameAs).toEqual(profile.socials.map((s) => s.url));
  });

  test("lists the skills and the credential the page shows", () => {
    const person = node("Person");
    const known = person.knowsAbout as string[];
    expect(known).toContain("Cloud Computing");
    expect(known.length).toBeGreaterThan(3);

    const credential = person.hasCredential as Node;
    expect(credential.name).toBe(credlyBadge.name);
    expect(credential.url).toBe(credlyBadge.url);
    expect(credential.recognizedBy).toMatchObject({ name: credlyBadge.issuer });
  });

  test("describes the site and the page, both pointing at the person", () => {
    expect(node("WebSite")).toMatchObject({
      "@id": websiteId,
      url: `${siteUrl}/`,
      name: profile.fullName,
    });
    expect(node("ProfilePage")).toMatchObject({
      url: `${siteUrl}/`,
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
    });
  });

  test("uses absolute URLs only, so the markup is valid off-site", () => {
    const json = JSON.stringify(structuredData());
    const urls = [...json.matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url.startsWith("https://")).toBe(true);
  });

  test("the serialized form cannot break out of its script tag", () => {
    const json = JSON.stringify(structuredData());
    expect(json).not.toContain("<");
    expect(json).not.toContain("</script");
  });

  test("every skill category name is represented in knowsAbout", () => {
    const known = node("Person").knowsAbout as string[];
    for (const category of skillCategories) {
      expect(known, category.name).toContain(category.name);
    }
  });
});
