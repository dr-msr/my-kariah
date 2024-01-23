"use client"

import { useState, useEffect } from 'react';
import { Subtitle, Text } from "@tremor/react"
import hadis from "@/lib/hadis.json"

function getRandomHadis() {
    const randomIndex = Math.floor(Math.random() * hadis.length);
    return hadis[randomIndex];
}

const SnippetHadis = () => {
    const [selectedHadis, setSelectedHadis] = useState({
		id : 0,
		hadis : "",
		rawi : ""
	});

	const hadis_load = getRandomHadis();

    useEffect(() => {
        return setSelectedHadis(hadis_load);
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!selectedHadis) return null;

    return (
        <>
            <Subtitle style={{ fontSize: 10 }}>Sabda Baginda s.a.w,</Subtitle>
            <div className="p-1">
                <Text style={{ fontSize: 10, marginLeft: 10 }}>{selectedHadis.hadis}</Text>
            </div>
            <Subtitle style={{ fontSize: 10, textAlign: "right" }}>{selectedHadis.rawi}</Subtitle>
        </>
    );
}

export default SnippetHadis