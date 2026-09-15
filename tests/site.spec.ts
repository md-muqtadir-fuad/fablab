import { test,expect,type APIRequestContext } from '@playwright/test';
const origin='http://localhost:3100';
const headers={Origin:origin};
const password='Correct-horse-battery-2026';
function futureDate(day?:number) {const date=new Date();date.setUTCDate(date.getUTCDate()+8);while(day!==undefined ? date.getUTCDay()!==day : [5,6].includes(date.getUTCDay()))date.setUTCDate(date.getUTCDate()+1);return date.toISOString().slice(0,10);}
async function register(api:APIRequestContext) {const response=await api.post('/api/auth',{headers,data:{mode:'register',name:'Test Member',email:`member-${crypto.randomUUID()}@example.test`,password}});expect(response.status()).toBe(200);}
const booking=()=>({equipmentId:'eq-fdm-1',date:futureDate(0),slot:'09:00–11:00',project:'Sensor housing prototype',organisation:'Mechanical Engineering',material:'PLA',training:'Completed FDM course; please verify certification.',agreement:true});

test('all public routes, detail pages, links, and local logos respond',async({request})=>{
  const routes=['/','/about','/explore','/make','/learn','/research','/research/themes','/research/collaborate','/collaborate','/collaborate/industry','/community','/facilities','/equipment','/projects','/projects/start','/training','/training/register','/visit','/consultation','/services/fabrication','/login','/bangla','/policies/privacy','/policies/terms','/accessibility',...['eq-fdm-1','eq-laser-1','eq-cnc-1','eq-sla-1','eq-robot-1','eq-pcb-1'].flatMap(id=>[`/equipment/${id}`,`/equipment/${id}/book`]),...['proj-1','proj-2','proj-3'].map(id=>`/projects/${id}`)];
  const links=new Set<string>();
  for(const route of routes){const response=await request.get(route);expect(response.status(),route).toBe(200);const html=await response.text();for(const match of html.matchAll(/href="(\/[^"#]*)"/g)){if(!match[1].startsWith('/_next/'))links.add(match[1].replaceAll('&amp;','&'));}}
  for(const link of links){const response=await request.get(link);expect(response.status(),link).toBeLessThan(400);}
  for(const route of ['/does-not-exist','/equipment/no-such-machine','/equipment/no-such-machine/book','/projects/no-such-project'])expect((await request.get(route)).status(),route).toBe(404);
  for(const file of ['buet.png','ugc.svg','heat.svg','world-bank.svg']){const response=await request.get('/logos/'+file);expect(response.status()).toBe(200);expect((await response.body()).length).toBeGreaterThan(1000);}
});

test('catalogue filters, sorting, gallery search and mobile navigation',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/equipment');await page.getByRole('searchbox',{name:'Search Equipment'}).fill('voltera');await expect(page.getByText('Showing 1 machines')).toBeVisible();await page.getByRole('button',{name:'Clear all'}).click();await page.getByLabel('Sort equipment').selectOption('name-desc');await expect(page.locator('h3').first()).toContainText('Voltera');await page.getByRole('searchbox',{name:'Search Equipment'}).fill('no-match');await expect(page.getByRole('heading',{name:'No equipment matches those filters'})).toBeVisible();
  await page.goto('/projects');await page.getByLabel('Search projects').fill('bamboo');await expect(page.getByRole('status')).toHaveText('1 projects found');await page.getByRole('link',{name:/Bamboo Composite Drone/}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Bamboo Composite Drone');
  for(const width of [360,768,1024,1440]){await page.setViewportSize({width,height:900});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`overflow at ${width}`).toBe(true);if(width<1280){await page.getByRole('button',{name:'Open main menu'}).click();await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toHaveCount(0);}}
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.goto('/equipment');await page.screenshot({path:'test-results/equipment-mobile.png',fullPage:true});expect(errors).toEqual([]);
});

test('registration, booking wizard, upload, persistence and cancellation',async({page})=>{
  await page.goto('/login');await page.getByRole('button',{name:'New to FabLab? Create an account'}).click();await page.getByLabel('Full name').fill('Browser Test Member');await page.getByLabel('Email',{exact:true}).fill(`browser-${crypto.randomUUID()}@example.test`);await page.getByLabel('Password').fill(password);await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page).toHaveURL(/dashboard/);
  await page.goto('/equipment/eq-pcb-1/book');await page.getByLabel('Your training or support needs').fill('Please arrange a supervised electronics session.');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('Session date').fill(futureDate(1));await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('Project title').fill('PCB test fixture');await page.getByLabel('Department or organisation').fill('Electronics');await page.getByLabel('Primary material').selectOption('FR4');await page.getByLabel('Design file (optional)').setInputFiles({name:'design.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nTest design\n%%EOF')});await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('PCB test fixture',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Back',exact:true}).click();await expect(page.getByLabel('Project title')).toHaveValue('PCB test fixture');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Submit booking request'}).click();await expect(page.getByRole('heading',{name:'Booking request saved'})).toBeVisible();await page.getByRole('link',{name:'View my bookings'}).click();await page.reload();await expect(page.getByText('PCB test fixture · FR4')).toBeVisible();await expect(page.getByRole('link',{name:'Download design.pdf'})).toBeVisible();await page.getByRole('button',{name:'Cancel booking',exact:true}).click();await page.getByRole('button',{name:'Yes, cancel booking'}).click();await expect(page.getByText('cancelled',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Sign out'}).click();await expect(page).toHaveURL(/login/);
});

test('enquiry validation and saved training request',async({page,request})=>{
  expect((await request.post('/api/requests',{headers,data:{subject:'Fabrication request',name:'  ',email:'bad',details:'short',consent:false}})).status()).toBe(400);
  await page.goto('/training/register');await page.getByLabel('Full name').fill('Training Visitor');await page.getByLabel('Email',{exact:true}).fill('visitor@example.test');await page.getByLabel('Department or organisation').fill('Architecture');await page.getByLabel('Training course').selectOption('New member orientation');await page.getByLabel('Tell us what you need').fill('I would like to attend the next introductory safety course.');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Register interest'}).click();await expect(page.getByRole('heading',{name:'Request saved'})).toBeVisible();await expect(page.getByText(/REQ-/)).toBeVisible();
});

test('server rejects unauthorized, closed-day, invalid-machine and duplicate bookings',async({request})=>{
  expect((await request.post('/api/bookings',{headers,data:booking()})).status()).toBe(401);
  expect((await request.post('/api/auth',{headers:{Origin:'https://evil.example'},data:{}})).status()).toBe(403);
  await register(request);
  for(const data of [{...booking(),date:futureDate(5)},{...booking(),material:'Unsafe material'},{...booking(),agreement:false}])expect((await request.post('/api/bookings',{headers,data})).status()).toBe(400);
  expect((await request.post('/api/bookings',{headers,data:{...booking(),equipmentId:'eq-sla-1'}})).status()).toBe(409);
  expect((await request.post('/api/bookings',{headers,data:{...booking(),equipmentId:'invalid'}})).status()).toBe(404);
  const results=await Promise.all([request.post('/api/bookings',{headers,data:booking()}),request.post('/api/bookings',{headers,data:booking()})]);expect(results.map(r=>r.status()).sort()).toEqual([201,409]);
  const available=await (await request.get(`/api/bookings?equipment=eq-fdm-1&date=${booking().date}`)).json();expect(available.slots).not.toContain(booking().slot);
  expect((await request.patch('/api/admin',{headers,data:{id:'none',kind:'bookings',status:'approved'}})).status()).toBe(403);
  const thursday=await (await request.get(`/api/bookings?equipment=eq-fdm-1&date=${futureDate(4)}`)).json();expect(thursday.slots).not.toContain('14:00–16:00');
});

test('staff review updates status and protects records from other accounts',async({playwright})=>{
  const member=await playwright.request.newContext({baseURL:origin}),staff=await playwright.request.newContext({baseURL:origin}),stranger=await playwright.request.newContext({baseURL:origin});await register(member);await register(stranger);
  const created=await member.post('/api/bookings',{headers,data:{...booking(),equipmentId:'eq-robot-1',material:'N/A - Payload dependent'}});expect(created.status()).toBe(201);const {id}=await created.json();
  expect((await stranger.delete(`/api/bookings/${id}`,{headers})).status()).toBe(404);
  expect((await staff.post('/api/auth',{headers,data:{mode:'register',email:'staff@example.test',name:'Attacker',password}})).status()).toBe(403);
  expect((await staff.post('/api/auth',{headers,data:{mode:'login',email:'staff@example.test',password:'Test-staff-password-2026'}})).status()).toBe(200);
  expect((await staff.get('/admin')).status()).toBe(200);expect((await staff.patch('/api/admin',{headers,data:{id,kind:'bookings',status:'approved'}})).status()).toBe(200);
  expect(await (await member.get('/dashboard')).text()).toContain('approved');
  expect((await staff.patch('/api/admin',{headers,data:{id,kind:'bookings',status:'completed'}})).status()).toBe(200);
  expect((await member.delete(`/api/bookings/${id}`,{headers})).status()).toBe(409);
  await member.dispose();await stranger.dispose();await staff.dispose();
});

test('every enquiry type persists and attachment access stays private',async({request,playwright})=>{
  await register(request);
  for(const subject of ['Training registration','Visit request','Fabrication request','Design consultation request','Industry collaboration enquiry','Research collaboration proposal','Project brief']){
    const response=await request.post('/api/requests',{headers,data:{subject,name:'Request Tester',email:'request@example.test',organisation:'Test Lab',details:'Please review the requirements for our upcoming fabrication project.',consent:true,course:'New member orientation',date:futureDate(2),visitors:'4'}});expect(response.status(),subject).toBe(201);const {id}=await response.json();expect(await (await request.get('/dashboard')).text()).toContain(id);
  }
  expect((await request.post('/api/uploads',{headers,multipart:{file:{name:'unsafe.html',mimeType:'text/html',buffer:Buffer.from('<script>test</script>')}}})).status()).toBe(400);
  const upload=await request.post('/api/uploads',{headers,multipart:{file:{name:'drawing.dxf',mimeType:'application/octet-stream',buffer:Buffer.from('0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF')}}});expect(upload.status()).toBe(201);const {id}=await upload.json();const file=await request.get(`/api/uploads/${id}`);expect(file.status()).toBe(200);expect(file.headers()['content-disposition']).toContain('attachment');
  const stranger=await playwright.request.newContext({baseURL:origin});expect((await stranger.get(`/api/uploads/${id}`)).status()).toBe(401);await register(stranger);expect((await stranger.get(`/api/uploads/${id}`)).status()).toBe(404);await stranger.dispose();
});
