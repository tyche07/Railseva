import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getGisData, GisSleeper } from '../../services/gisService';
import { Severity, IssueType } from '../../types';

// Custom icon creation
const getMarkerIcon = (severity?: Severity) => {
    const getColor = () => {
        if (!severity) return '#22c55e'; // green for Healthy
        switch (severity) {
            case Severity.HIGH: return '#ef4444'; // red
            case Severity.MEDIUM: return '#f59e0b'; // amber
            case Severity.LOW: return '#eab308'; // yellow
            default: return '#22c55e'; // green
        }
    };
    
    const iconHtml = `
      <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${getColor()}" stroke="#fff" stroke-width="1"/>
      </svg>`;
      
    return new L.DivIcon({
        html: iconHtml,
        className: 'custom-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const severityOptions = ['All', ...Object.values(Severity)];
const issueTypeOptions = ['All', ...Object.values(IssueType)];

const GisMapView: React.FC = () => {
    const allSleepers = useMemo(() => getGisData(), []);
    const [severityFilter, setSeverityFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const filteredSleepers = useMemo(() => {
        return allSleepers.filter(sleeper => {
            if (sleeper.status === 'Healthy') {
                // Only show healthy sleepers if no specific issue filter is active
                return severityFilter === 'All' && typeFilter === 'All';
            }
            const severityMatch = severityFilter === 'All' || sleeper.issue?.severity === severityFilter;
            const typeMatch = typeFilter === 'All' || sleeper.issue?.type === typeFilter;
            return severityMatch && typeMatch;
        });
    }, [allSleepers, severityFilter, typeFilter]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-[600px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">GIS Track Health Map</h3>
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700">Filter by Severity</label>
                    <select
                        id="severity-filter"
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm rounded-md"
                    >
                        {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Filter by Issue Type</label>
                    <select
                        id="type-filter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm rounded-md"
                    >
                       {issueTypeOptions.map(it => <option key={it} value={it}>{it}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex-grow rounded-lg overflow-hidden">
                 <MapContainer center={[28.6139, 77.2090]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredSleepers.map(sleeper => (
                        <Marker 
                            key={sleeper.uid} 
                            position={[sleeper.location.lat, sleeper.location.lng]}
                            icon={getMarkerIcon(sleeper.issue?.severity)}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <p className="font-bold">{sleeper.uid}</p>
                                    <p><strong>Status:</strong> {sleeper.status}</p>
                                    {sleeper.issue && (
                                        <>
                                            <p><strong>Issue:</strong> {sleeper.issue.type}</p>
                                            <p><strong>Severity:</strong> {sleeper.issue.severity}</p>
                                            <p><strong>Notes:</strong> {sleeper.issue.notes}</p>
                                        </>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
             <style>{`
                .custom-leaflet-icon {
                    background: transparent;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default GisMapView;
