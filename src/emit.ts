import { v4 as uuidv4 } from "uuid";
import { DependencyList, useLayoutEffect } from "react";
import _ from "lodash";

const EventEmitter = {
  _events: {},
  dispatch: function (event: string, data?: any) {
    if (!this._events[event]) return;
    _.forEach(this._events[event], (callback) => {
      if (data !== undefined) return callback(data);
      return callback();
    });
  },
  subscribe: function (event: string, callback: (data?: any) => void): string {
    if (!this._events[event]) this._events[event] = {};
    const listenerId = uuidv4();
    this._events[event][listenerId] = callback;
    return listenerId;
  },
  unsubscribe: function (event: string, listenerId: string) {
    if (!this._events[event]) this._events[event] = {};
    delete this._events[event][listenerId];
  },
};

const emit = (eventName: string, data?: any) =>
  EventEmitter.dispatch(eventName, data);

const useOn = (
  eventName: string,
  callback: (...args: any[]) => void,
  deps: DependencyList = [],
) => {
  useLayoutEffect(() => {
    const listener = EventEmitter.subscribe(eventName, callback);
    return () => {
      EventEmitter.unsubscribe(eventName, listener);
    };
  }, [...deps, eventName]);
};

export { emit, useOn };
