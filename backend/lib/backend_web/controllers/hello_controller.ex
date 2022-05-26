defmodule BackendWeb.HelloController do
  use BackendWeb, :controller

  action_fallback  BackendWeb.FallbackController

  def hello(conn, %{"name" => name}) do

    render(conn, "hello.json", name: name)
  end

end
