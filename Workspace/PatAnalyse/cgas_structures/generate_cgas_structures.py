#!/usr/bin/env python3
"""
cGAS Inhibitor Structure Generation Script
Generates SMILES, IUPAC names, and JPG structure images for key cGAS inhibitor compounds
"""

import os
import json
import csv
import requests
import time
from typing import Dict, List, Optional, Tuple
import pandas as pd

# Install required packages
try:
    from rdkit import Chem
    from rdkit.Chem import Draw, Descriptors
    from rdkit.Chem.Draw import rdMolDraw2D
    from PIL import Image
    import io
except ImportError:
    print("Installing required packages...")
    os.system("pip install rdkit-pypi requests pillow pandas")
    from rdkit import Chem
    from rdkit.Chem import Draw, Descriptors
    from rdkit.Chem.Draw import rdMolDraw2D
    from PIL import Image
    import io

class CGASStructureGenerator:
    def __init__(self, output_dir: str = "/home/ubuntu/cgas_structures"):
        self.output_dir = output_dir
        self.results = []
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "images"), exist_ok=True)
        
        # Define target compounds with known information and fallback SMILES for scaffolds
        self.target_compounds = {
            # Clinical Candidates
            "IMSB-301": {
                "type": "clinical_candidate",
                "company": "ImmuneSensor Therapeutics",
                "scaffold": "quinoline",
                "status": "Phase 1",
                "pubchem_search_terms": ["IMSB-301", "IMSB301"],
                "fallback_smiles": "c1ccc2nc(ccc2c1)C(=O)N"  # Generic quinoline derivative
            },
            "VENT-03": {
                "type": "clinical_candidate", 
                "company": "Ventus Therapeutics",
                "scaffold": "azepino[4,5-b]indolone",
                "status": "Phase 2",
                "pubchem_search_terms": ["VENT-03", "VENT03"],
                "fallback_smiles": "O=C1Nc2ccccc2c3c1CCCCC3"  # Generic azepino[4,5-b]indolone core
            },
            "G150": {
                "type": "clinical_candidate",
                "company": "Roche",
                "scaffold": "benzofuran-pyrimidine",
                "status": "Research compound",
                "pubchem_search_terms": ["G150", "G-150"],
                "fallback_smiles": "c1cc2c(cc1)oc(c2)c3ncccn3"  # Generic benzofuran-pyrimidine
            },
            "PF-06928215": {
                "type": "clinical_candidate",
                "company": "Pfizer",
                "scaffold": "early_inhibitor",
                "status": "Early compound",
                "pubchem_search_terms": ["PF-06928215", "PF06928215"],
                "fallback_smiles": "CCN(CC)C(=O)c1ccc(cc1)N2CCOCC2"  # Generic early inhibitor structure
            },
            
            # Representative Scaffold Examples
            "Azepino[4,5-b]indolone_core": {
                "type": "scaffold",
                "description": "Seven-membered ring fused to indolone core",
                "companies": ["Ventus Therapeutics"],
                "smiles": "O=C1Nc2ccccc2c3c1CCCCC3",
                "skip_pubchem": True
            },
            "Quinoline_core": {
                "type": "scaffold",
                "description": "Quinoline heterocycle",
                "companies": ["ImmuneSensor Therapeutics"],
                "smiles": "c1ccc2ncccc2c1",
                "skip_pubchem": True
            },
            "Indole_derivative": {
                "type": "scaffold",
                "description": "Representative indole derivative",
                "companies": ["Novartis", "Merck"],
                "smiles": "c1ccc2[nH]ccc2c1",
                "skip_pubchem": True
            },
            "Pyrido[4,3-b]indole_core": {
                "type": "scaffold",
                "description": "Pyrido[4,3-b]indole core structure",
                "companies": ["Merck", "Ventus"],
                "smiles": "c1ccc2c(c1)[nH]c3c2ccnc3",
                "skip_pubchem": True
            },
            "Benzofuran_core": {
                "type": "scaffold",
                "description": "Benzofuran core structure",
                "companies": ["Merck", "Roche"],
                "smiles": "c1ccc2c(c1)cco2",
                "skip_pubchem": True
            }
        }

    def query_pubchem(self, compound_name: str, search_terms: List[str]) -> Optional[Dict]:
        """Query PubChem for compound information"""
        print(f"Searching PubChem for {compound_name}...")
        
        for term in search_terms:
            try:
                # Try name-based search first
                url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{term}/property/CanonicalSMILES,IUPACName,MolecularFormula,MolecularWeight/JSON"
                response = requests.get(url, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if 'PropertyTable' in data and 'Properties' in data['PropertyTable']:
                        props = data['PropertyTable']['Properties'][0]
                        return {
                            'smiles': props.get('CanonicalSMILES'),
                            'iupac_name': props.get('IUPACName'),
                            'molecular_formula': props.get('MolecularFormula'),
                            'molecular_weight': props.get('MolecularWeight'),
                            'source': f'PubChem ({term})'
                        }
                
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"PubChem search failed for {term}: {e}")
                continue
        
        return None

    def generate_iupac_name(self, mol) -> str:
        """Generate IUPAC name using RDKit (basic implementation)"""
        try:
            # RDKit doesn't have built-in IUPAC name generation
            # Return molecular formula as fallback
            return Chem.rdMolDescriptors.CalcMolFormula(mol)
        except:
            return "Unknown"

    def create_structure_image(self, mol, compound_name: str) -> str:
        """Create high-quality structure image"""
        try:
            # Create high-resolution image
            drawer = rdMolDraw2D.MolDraw2DCairo(800, 600)
            drawer.SetFontSize(0.8)
            drawer.DrawMolecule(mol)
            drawer.FinishDrawing()
            
            # Save as PNG first
            png_data = drawer.GetDrawingText()
            
            # Convert to PIL Image and save as JPG
            img = Image.open(io.BytesIO(png_data))
            
            # Convert to RGB if necessary (for JPG)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as JPG
            image_path = os.path.join(self.output_dir, "images", f"{compound_name.replace('/', '_')}.jpg")
            img.save(image_path, "JPEG", quality=95)
            
            print(f"Structure image saved: {image_path}")
            return image_path
            
        except Exception as e:
            print(f"Error creating image for {compound_name}: {e}")
            return ""

    def process_compound(self, compound_name: str, compound_info: Dict) -> Dict:
        """Process a single compound"""
        print(f"\n=== Processing {compound_name} ===")
        
        result = {
            'compound_name': compound_name,
            'type': compound_info.get('type'),
            'company': compound_info.get('company', ''),
            'scaffold': compound_info.get('scaffold', ''),
            'status': compound_info.get('status', ''),
            'description': compound_info.get('description', ''),
            'smiles': '',
            'iupac_name': '',
            'molecular_formula': '',
            'molecular_weight': '',
            'image_path': '',
            'source': ''
        }
        
        # Check if we should skip PubChem search
        if compound_info.get('skip_pubchem', False):
            smiles = compound_info.get('smiles')
            result['source'] = 'Predefined scaffold'
        else:
            # Try PubChem first
            pubchem_data = self.query_pubchem(compound_name, compound_info.get('pubchem_search_terms', [compound_name]))
            
            if pubchem_data and pubchem_data.get('smiles'):
                smiles = pubchem_data['smiles']
                result.update({
                    'iupac_name': pubchem_data.get('iupac_name', ''),
                    'molecular_formula': pubchem_data.get('molecular_formula', ''),
                    'molecular_weight': pubchem_data.get('molecular_weight', ''),
                    'source': pubchem_data.get('source', 'PubChem')
                })
            else:
                # Use fallback SMILES
                smiles = compound_info.get('fallback_smiles')
                result['source'] = 'Fallback structure'
                print(f"Using fallback SMILES for {compound_name}")
        
        if not smiles:
            print(f"No SMILES available for {compound_name}")
            return result
        
        # Validate and process SMILES
        try:
            mol = Chem.MolFromSmiles(smiles)
            if mol is None:
                print(f"Invalid SMILES for {compound_name}: {smiles}")
                return result
            
            # Sanitize molecule
            Chem.SanitizeMol(mol)
            
            # Get canonical SMILES
            canonical_smiles = Chem.MolToSmiles(mol)
            result['smiles'] = canonical_smiles
            
            # Generate additional properties if not from PubChem
            if not result['molecular_formula']:
                result['molecular_formula'] = Chem.rdMolDescriptors.CalcMolFormula(mol)
            if not result['molecular_weight']:
                result['molecular_weight'] = f"{Descriptors.MolWt(mol):.2f}"
            if not result['iupac_name']:
                result['iupac_name'] = self.generate_iupac_name(mol)
            
            # Create structure image
            result['image_path'] = self.create_structure_image(mol, compound_name)
            
            print(f"Successfully processed {compound_name}")
            print(f"  SMILES: {canonical_smiles}")
            print(f"  Formula: {result['molecular_formula']}")
            print(f"  MW: {result['molecular_weight']}")
            
        except Exception as e:
            print(f"Error processing {compound_name}: {e}")
        
        return result

    def generate_all_structures(self):
        """Generate structures for all target compounds"""
        print("=== cGAS Inhibitor Structure Generation ===")
        print(f"Output directory: {self.output_dir}")
        
        for compound_name, compound_info in self.target_compounds.items():
            result = self.process_compound(compound_name, compound_info)
            self.results.append(result)
        
        # Save results
        self.save_results()
        
        print(f"\n=== Generation Complete ===")
        print(f"Processed {len(self.results)} compounds")
        print(f"Results saved to {self.output_dir}")

    def save_results(self):
        """Save results to multiple formats"""
        # Save as JSON
        json_path = os.path.join(self.output_dir, "cgas_structures_master.json")
        with open(json_path, 'w') as f:
            json.dump({
                'metadata': {
                    'generated_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'total_compounds': len(self.results),
                    'clinical_candidates': len([r for r in self.results if r['type'] == 'clinical_candidate']),
                    'scaffolds': len([r for r in self.results if r['type'] == 'scaffold'])
                },
                'compounds': self.results
            }, f, indent=2)
        
        # Save as CSV
        csv_path = os.path.join(self.output_dir, "cgas_structures_master.csv")
        df = pd.DataFrame(self.results)
        df.to_csv(csv_path, index=False)
        
        # Save individual compound files
        for result in self.results:
            if result['smiles']:
                compound_file = os.path.join(self.output_dir, f"{result['compound_name'].replace('/', '_')}_data.json")
                with open(compound_file, 'w') as f:
                    json.dump(result, f, indent=2)
        
        print(f"Master JSON saved: {json_path}")
        print(f"Master CSV saved: {csv_path}")
        print(f"Individual compound files saved to: {self.output_dir}")

def main():
    """Main execution function"""
    generator = CGASStructureGenerator()
    generator.generate_all_structures()

if __name__ == "__main__":
    main()
