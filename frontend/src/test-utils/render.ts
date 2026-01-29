import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes, Router } from '@angular/router';

interface RenderPageOptions {
  routes?: Routes;
  providers?: Provider[];
  imports?: Array<Type<unknown> | object>;
}

export async function renderPage<T>(
  component: Type<T>,
  options: RenderPageOptions = {}
): Promise<{ fixture: ReturnType<typeof TestBed.createComponent<T>>; instance: T; router: Router }> {
  const { routes = [], providers = [], imports = [] } = options;

  await TestBed.configureTestingModule({
    imports: [component, ...imports],
    providers: [provideRouter(routes), ...providers]
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    fixture,
    instance: fixture.componentInstance,
    router: TestBed.inject(Router)
  };
}
