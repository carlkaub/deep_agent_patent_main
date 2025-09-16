#!/usr/bin/env python3
"""
Create comprehensive visualizations for cGAS inhibitor patent landscape report
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import json
import numpy as np

def create_patent_filing_trends():
    """Create patent filing trends visualization"""
    years = list(range(2015, 2025))
    # Based on patent landscape data - activity levels converted to approximate numbers
    activity_mapping = {
        'Low': 5, 'Moderate': 15, 'Moderate-High': 25, 'High': 35
    }
    
    patent_counts = [5, 15, 25, 35, 35, 35, 30, 25, 25, 20]  # Estimated based on activity descriptions
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=years,
        y=patent_counts,
        mode='lines+markers',
        name='Patent Filings',
        line=dict(color='#1f77b4', width=3),
        marker=dict(size=8, color='#1f77b4')
    ))
    
    # Add annotations for key events
    fig.add_annotation(
        x=2017, y=25,
        text="Peak Activity<br>Key Players Active",
        showarrow=True,
        arrowhead=2,
        arrowcolor="red",
        font=dict(size=10)
    )
    
    fig.add_annotation(
        x=2022, y=25,
        text="Clinical Candidates<br>Emerge",
        showarrow=True,
        arrowhead=2,
        arrowcolor="green",
        font=dict(size=10)
    )
    
    fig.update_layout(
        title='cGAS Inhibitor Patent Filing Trends (2015-2024)',
        xaxis_title='Year',
        yaxis_title='Estimated Patent Filings',
        template='plotly_white',
        width=800,
        height=500
    )
    
    return fig

def create_geographic_distribution():
    """Create geographic distribution of patents"""
    jurisdictions = ['WO/PCT', 'US', 'EP', 'CN', 'JP']
    percentages = [75, 75, 70, 50, 50]
    
    fig = go.Figure(data=[
        go.Bar(
            x=jurisdictions,
            y=percentages,
            marker_color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
            text=[f'{p}%' for p in percentages],
            textposition='auto'
        )
    ])
    
    fig.update_layout(
        title='Geographic Distribution of cGAS Inhibitor Patents',
        xaxis_title='Jurisdiction',
        yaxis_title='Percentage of Patents Filed (%)',
        template='plotly_white',
        width=700,
        height=500
    )
    
    return fig

def create_company_landscape():
    """Create competitive landscape visualization"""
    companies = ['Ventus Therapeutics', 'ImmuneSensor', 'Novartis', 'Merck & Co', 'Roche', 'Pfizer', 'Boehringer Ingelheim']
    clinical_stage = [2, 1, 0, 0, 0, 0, 0]  # Phase numbers
    patent_count = [5, 3, 8, 10, 6, 4, 3]  # Estimated patent families
    funding = [300, 50, 835, 0, 0, 0, 0]  # Million USD
    
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Clinical Stage by Company', 'Patent Portfolio Size', 
                       'Investment/Funding (M USD)', 'Company Type Distribution'),
        specs=[[{"type": "bar"}, {"type": "bar"}],
               [{"type": "bar"}, {"type": "pie"}]]
    )
    
    # Clinical stage
    fig.add_trace(
        go.Bar(x=companies, y=clinical_stage, name='Clinical Stage',
               marker_color='#2ca02c'),
        row=1, col=1
    )
    
    # Patent count
    fig.add_trace(
        go.Bar(x=companies, y=patent_count, name='Patent Families',
               marker_color='#1f77b4'),
        row=1, col=2
    )
    
    # Funding
    fig.add_trace(
        go.Bar(x=companies, y=funding, name='Funding/Investment',
               marker_color='#ff7f0e'),
        row=2, col=1
    )
    
    # Company types
    company_types = ['Biotech', 'Large Pharma']
    type_counts = [2, 5]
    fig.add_trace(
        go.Pie(labels=company_types, values=type_counts, name='Company Types'),
        row=2, col=2
    )
    
    fig.update_layout(
        title_text='cGAS Inhibitor Competitive Landscape Analysis',
        showlegend=False,
        width=1000,
        height=800
    )
    
    return fig

def create_chemical_scaffold_analysis():
    """Create chemical scaffold distribution"""
    scaffolds = ['Azepino[4,5-b]indolones', 'Quinolines', 'Indole derivatives', 
                'Pyrido[4,3-b]indoles', 'Benzofurans', 'Thiazoles', 'Others']
    companies = [1, 1, 2, 2, 2, 1, 3]  # Number of companies working on each
    clinical_candidates = [1, 1, 0, 0, 0, 0, 2]  # Clinical candidates per scaffold
    
    fig = make_subplots(
        rows=1, cols=2,
        subplot_titles=('Companies per Scaffold', 'Clinical Candidates per Scaffold'),
        specs=[[{"type": "bar"}, {"type": "bar"}]]
    )
    
    fig.add_trace(
        go.Bar(x=scaffolds, y=companies, name='Companies',
               marker_color='#1f77b4'),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Bar(x=scaffolds, y=clinical_candidates, name='Clinical Candidates',
               marker_color='#2ca02c'),
        row=1, col=2
    )
    
    fig.update_layout(
        title_text='Chemical Scaffold Analysis in cGAS Inhibitor Development',
        showlegend=False,
        width=1200,
        height=500
    )
    
    # Rotate x-axis labels
    fig.update_xaxes(tickangle=45)
    
    return fig

def create_clinical_pipeline():
    """Create clinical pipeline visualization"""
    compounds = ['IMSB-301', 'VENT-03', 'G150', 'PF-06928215']
    phases = [1, 2, 0, 0]  # Phase numbers (0 = preclinical/research)
    companies = ['ImmuneSensor', 'Ventus', 'Roche', 'Pfizer']
    indications = ['AGS/SLE', 'SLE/RA', 'Research', 'Early Research']
    
    # Create timeline visualization
    fig = go.Figure()
    
    colors = ['#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    
    for i, (compound, phase, company, indication) in enumerate(zip(compounds, phases, companies, indications)):
        fig.add_trace(go.Scatter(
            x=[phase],
            y=[i],
            mode='markers+text',
            marker=dict(size=20, color=colors[i]),
            text=f'{compound}<br>({company})',
            textposition='middle right',
            name=f'{compound} - {indication}',
            showlegend=True
        ))
    
    fig.update_layout(
        title='cGAS Inhibitor Clinical Pipeline',
        xaxis=dict(
            title='Development Phase',
            tickmode='array',
            tickvals=[0, 1, 2, 3],
            ticktext=['Preclinical', 'Phase 1', 'Phase 2', 'Phase 3']
        ),
        yaxis=dict(
            title='Compounds',
            tickmode='array',
            tickvals=list(range(len(compounds))),
            ticktext=compounds
        ),
        template='plotly_white',
        width=800,
        height=500
    )
    
    return fig

def create_indication_analysis():
    """Create target indication analysis"""
    indications = ['SLE', 'AGS', 'RA', 'CLE', 'Dermatomyositis', 'Systemic Sclerosis', 'NASH', 'Neurodegeneration']
    clinical_programs = [2, 1, 1, 1, 0, 0, 1, 0]  # Number of clinical programs
    market_size = [7.5, 0.01, 25, 1.2, 0.8, 2.5, 35, 150]  # Billion USD (estimated)
    
    fig = make_subplots(
        rows=1, cols=2,
        subplot_titles=('Clinical Programs per Indication', 'Market Size (Billion USD)'),
        specs=[[{"type": "bar"}, {"type": "bar"}]]
    )
    
    fig.add_trace(
        go.Bar(x=indications, y=clinical_programs, name='Clinical Programs',
               marker_color='#2ca02c'),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Bar(x=indications, y=market_size, name='Market Size',
               marker_color='#ff7f0e'),
        row=1, col=2
    )
    
    fig.update_layout(
        title_text='Target Indication Analysis for cGAS Inhibitors',
        showlegend=False,
        width=1200,
        height=500
    )
    
    fig.update_xaxes(tickangle=45)
    
    return fig

def save_all_visualizations():
    """Generate and save all visualizations"""
    
    # Create all figures
    figs = {
        'patent_filing_trends': create_patent_filing_trends(),
        'geographic_distribution': create_geographic_distribution(),
        'company_landscape': create_company_landscape(),
        'chemical_scaffolds': create_chemical_scaffold_analysis(),
        'clinical_pipeline': create_clinical_pipeline(),
        'indication_analysis': create_indication_analysis()
    }
    
    # Save as HTML files
    for name, fig in figs.items():
        fig.write_html(f'/home/ubuntu/{name}.html')
        print(f"Saved {name}.html")
    
    # Create a combined dashboard
    dashboard_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>cGAS Inhibitor Patent Landscape Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .chart-container { margin: 20px 0; }
            h1, h2 { color: #333; }
        </style>
    </head>
    <body>
        <h1>cGAS Inhibitor Patent Landscape Dashboard</h1>
        <div class="chart-container">
            <h2>Patent Filing Trends</h2>
            <iframe src="patent_filing_trends.html" width="100%" height="600"></iframe>
        </div>
        <div class="chart-container">
            <h2>Geographic Distribution</h2>
            <iframe src="geographic_distribution.html" width="100%" height="600"></iframe>
        </div>
        <div class="chart-container">
            <h2>Competitive Landscape</h2>
            <iframe src="company_landscape.html" width="100%" height="900"></iframe>
        </div>
        <div class="chart-container">
            <h2>Chemical Scaffolds</h2>
            <iframe src="chemical_scaffolds.html" width="100%" height="600"></iframe>
        </div>
        <div class="chart-container">
            <h2>Clinical Pipeline</h2>
            <iframe src="clinical_pipeline.html" width="100%" height="600"></iframe>
        </div>
        <div class="chart-container">
            <h2>Target Indications</h2>
            <iframe src="indication_analysis.html" width="100%" height="600"></iframe>
        </div>
    </body>
    </html>
    """
    
    with open('/home/ubuntu/cgas_dashboard.html', 'w') as f:
        f.write(dashboard_html)
    
    print("Created comprehensive dashboard: cgas_dashboard.html")
    
    return figs

if __name__ == "__main__":
    save_all_visualizations()
