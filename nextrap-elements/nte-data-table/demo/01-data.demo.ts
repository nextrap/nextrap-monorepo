import '@nextrap/style-base/default';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteDataTableElement, TableDefinition } from '../index';

interface Customer { id: number; name: string; amount: number; active: boolean; }
const data: Customer[] = [{id:1,name:'Ada GmbH',amount:1200,active:true},{id:2,name:'Turing AG',amount:850,active:false}];
const definition: TableDefinition<Customer> = {id:'customers',rowId:'id',columns:[
  {id:'name',header:'Name',field:'name',defaultWidth:220},
  {id:'amount',header:'Umsatz',field:'amount',preset:'number',defaultWidth:140},
  {id:'active',header:'Aktiv',field:'active',preset:'boolean',defaultWidth:100}
]};
export default defineDemo({title:'Data und View State',description:'Rendert Objekte und zeigt serialisierbaren Benutzerzustand.',render(root){
  root.innerHTML='<nte-data-table height="18rem"></nte-data-table><pre data-state></pre>';
  const table=root.querySelector<NteDataTableElement<Customer>>('nte-data-table')!; table.definition=definition; table.data=data;
  table.addEventListener('nte-data-table-view-state-change',(event)=>{root.querySelector('[data-state]')!.textContent=JSON.stringify((event as CustomEvent).detail.state,null,2);});
}});
