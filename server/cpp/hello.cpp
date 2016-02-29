#include <node.h>

#ifdef WIN32
# include <windows.h>
#else
# include <unistd.h>
#endif // !WIN32

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void hello(const FunctionCallbackInfo<Value> &args)
{
  Isolate* isolate = args.GetIsolate();

  sleep(5);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Notification: From C++ with love <3"));
}

void init(Local<Object> exports)
{
  NODE_SET_METHOD(exports, "hello", hello);
}

NODE_MODULE(addon, init)
