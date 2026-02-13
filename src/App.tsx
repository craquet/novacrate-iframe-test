import './App.css'
import {useCallback, useEffect, useRef} from "react";
import * as z from "zod/mini";

const exampleCrate = "{\n" +
    "    \"@context\": \"https://w3id.org/ro/crate/1.1/context\",\n" +
    "    \"@graph\": [\n" +
    "        {\n" +
    "            \"@id\": \"./\",\n" +
    "            \"@type\": \"Dataset\",\n" +
    "            \"name\": \"Air measurements in Karlsruhe\",\n" +
    "            \"description\": \"Air quality measurements conducted in different places across Karlsruhe\",\n" +
    "            \"datePublished\": \"2024\",\n" +
    "            \"license\": {\n" +
    "                \"@id\": \"https://creativecommons.org/licenses/by/4.0/\"\n" +
    "            },\n" +
    "            \"hasPart\": [\n" +
    "                {\n" +
    "                    \"@id\": \"map.pdf\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"@id\": \"measurements/HVV%2520Anwesenheit%2520WiSe%25202526.pdf\"\n" +
    "                }\n" +
    "            ],\n" +
    "            \"author\": [\n" +
    "                {\n" +
    "                    \"@id\": \"creator\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"@id\": \"#christopher%20raquet\"\n" +
    "                }\n" +
    "            ]\n" +
    "        },\n" +
    "        {\n" +
    "            \"@type\": \"CreativeWork\",\n" +
    "            \"@id\": \"ro-crate-metadata.json\",\n" +
    "            \"conformsTo\": {\n" +
    "                \"@id\": \"https://w3id.org/ro/crate/1.1\"\n" +
    "            },\n" +
    "            \"about\": {\n" +
    "                \"@id\": \"./\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"map.pdf\",\n" +
    "            \"@type\": \"File\",\n" +
    "            \"name\": \"Map of measurements\",\n" +
    "            \"description\": \"A map of all the location where the tests have been conducted\",\n" +
    "            \"datePublished\": \"2021-10-22T00:00:00Z\",\n" +
    "            \"encodingFormat\": \"application/pdf\",\n" +
    "            \"author\": {\n" +
    "                \"@id\": \"creator\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"creator\",\n" +
    "            \"@type\": \"Person\",\n" +
    "            \"email\": \"john.doe@kit.edu\",\n" +
    "            \"givenName\": \"John\",\n" +
    "            \"familyName\": \"Doe\",\n" +
    "            \"nationality\": {\n" +
    "                \"@id\": \"https://www.geonames.org/2921044\"\n" +
    "            },\n" +
    "            \"affiliation\": {\n" +
    "                \"@id\": \"https://www.geonames.org/7288147\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"https://creativecommons.org/licenses/by/4.0/\",\n" +
    "            \"@type\": \"CreativeWork\",\n" +
    "            \"name\": \"CC BY 4.0\",\n" +
    "            \"description\": \"Creative Commons Attribution 4.0 International License\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"https://www.geonames.org/2921044\",\n" +
    "            \"@type\": \"Place\",\n" +
    "            \"description\": \"Big country in central Europe.\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"#MeasurementCapture_23231\",\n" +
    "            \"@type\": \"CreateAction\",\n" +
    "            \"agent\": {\n" +
    "                \"@id\": \"creator\"\n" +
    "            },\n" +
    "            \"instrument\": {\n" +
    "                \"@id\": \"https://www.aeroqual.com/product/outdoor-portable-monitor-starter-kit\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"kit_location\",\n" +
    "            \"@type\": \"Place\",\n" +
    "            \"geo\": {\n" +
    "                \"@id\": \"#4241434-33413\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"#4241434-33413\",\n" +
    "            \"@type\": \"GeoCoordinates\",\n" +
    "            \"latitude\": \"49.00944\",\n" +
    "            \"longitude\": \"8.41167\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"https://www.geonames.org/7288147\",\n" +
    "            \"@type\": \"Organization\",\n" +
    "            \"name\": \"Karlsruher Institut fuer Technologie\",\n" +
    "            \"url\": \"https://www.kit.edu/\",\n" +
    "            \"location\": {\n" +
    "                \"@id\": \"kit_location\"\n" +
    "            }\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"https://www.aeroqual.com/product/outdoor-portable-monitor-starter-kit\",\n" +
    "            \"@type\": \"IndividualProduct\",\n" +
    "            \"description\": \"The Outdoor Air Quality Test Kit (Starter) is for users who want an affordable set of tools to measure the common pollutants in ambient outdoor air.\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"@id\": \"measurements/HVV%2520Anwesenheit%2520WiSe%25202526.pdf\",\n" +
    "            \"@type\": \"File\",\n" +
    "            \"name\": \"HVV Anwesenheit WiSe 2526\",\n" +
    "            \"contentSize\": \"225285\",\n" +
    "            \"encodingFormat\": \"application/pdf\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"name\": \"Christopher Raquet\",\n" +
    "            \"@id\": \"#christopher%20raquet\",\n" +
    "            \"@type\": [\n" +
    "                \"Person\"\n" +
    "            ]\n" +
    "        }\n" +
    "    ]\n" +
    "}"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const incomingMessageSchema = z.xor([
    z.object({
        target: z.literal("novacrate"),
        type: z.literal("LOAD_CRATE"),
        metadata: z.string()
    }),
    z.object({
        target: z.literal("novacrate"),
        type: z.literal("GET_CRATE")
    })
])

const outgoingMessageSchema = z.xor([
    z.object({
        source: z.literal("novacrate"),
        type: z.literal("READY"),
        novaCrateVersion: z.string(),
        messageInterfaceVersion: z.number()
    }),
    z.object({
        source: z.literal("novacrate"),
        type: z.literal("GET_CRATE_RESPONSE"),
        metadata: z.string()
    }),
    z.object({
        source: z.literal("novacrate"),
        type: z.literal("CRATE_CHANGED"),
        metadata: z.string()
    })
])

type NovaCrateMessageIncoming = z.infer<typeof incomingMessageSchema>

function App() {
    const iframe = useRef<HTMLIFrameElement>(null);

    const pushCrate = useCallback(() => {
        iframe.current?.contentWindow?.postMessage({
            target: "novacrate",
            type: "LOAD_CRATE",
            metadata: exampleCrate
        } satisfies NovaCrateMessageIncoming, "http://localhost:3000", [])
    }, []);

    const pullCrate = useCallback(() => {
        iframe.current?.contentWindow?.postMessage({
            target: "novacrate",
            type: "GET_CRATE",
        } satisfies NovaCrateMessageIncoming, "http://localhost:3000", [])
    }, []);

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            const parsed = outgoingMessageSchema.safeParse(event.data)
            if (parsed.success) {
                if (parsed.data.type === "READY") {
                    pushCrate()
                } else if (parsed.data.type === "GET_CRATE_RESPONSE") {
                    console.log("Received metadata", parsed.data.metadata)
                }
            }
        }

        window.addEventListener("message", listener)
        return () => window.removeEventListener("message", listener)
    }, [pushCrate]);

    return (
        <div>
            This demo integrates NovaCrate in Iframe mode and loads the crate "Air measurements in Karlsruhe" immediately once NovaCrate sends the READY message. Additional messages can be sent using the buttons below.
            <iframe ref={iframe} width={1280} height={700} src="http://localhost:3000/editor/iframe/entities"/>
            <div style={{padding: 5}}>
                <button style={{marginRight: 5}} onClick={pushCrate}>Push Crate</button>
                <button onClick={pullCrate}>Pull Crate</button>
            </div>

        </div>
    )
}

export default App
