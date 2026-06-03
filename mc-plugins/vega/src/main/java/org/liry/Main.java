package org.liry;


import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.jspecify.annotations.NonNull;
import org.liry.vega.VegaStatic;

public class Main extends JavaPlugin implements Listener {
  @Override
  public void onEnable() {
    getLogger().info("Vega on enable");
    Bukkit.getPluginManager().registerEvents(this, this);
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent event) {
    var p = event.getPlayer();
    getLogger().info(String.format("Vega on player join: player %s ", p.getName()));
    p.sendMessage("Hello, " + p.getName() + "!");
    VegaStatic.giveNightVision(p);
  }

  @Override
  public boolean onCommand(@NonNull CommandSender sender, @NonNull Command command, @NonNull String label, String @NonNull [] args) {
    var l = getLogger();
    l.info(String.format("Vega on command, sender %s command %s label %s args %s", sender.getName(), command, label, String.join(" ", args)));
    return true;
  }

  @EventHandler
  public void onEntityDamage(EntityDamageByEntityEvent e) {
    var d = e.getDamager();
    var t = e.getEntity();
    var l = getLogger();

    // 攻击者不是玩家，直接返回
    if (!(d instanceof Player a)) {
      l.info("[伤害拦截] 攻击者非玩家，跳过处理");
      return;
    }

    // 不是OP，放行
    if (!a.isOp()) {
      l.info(String.format("[伤害拦截] 玩家 %s 非OP，放行原版伤害", a.getName()));
      return;
    }

    l.info(String.format("[OP秒杀触发] 操作者：%s | 目标实体类型：%s", a.getName(), t.getType()));

    if (t instanceof LivingEntity livingTarget) {
      var currentHp = livingTarget.getHealth();
      var newDamage = currentHp * 2.0;
      e.setDamage(newDamage);
      livingTarget.setHealth(0.0);

      l.info(String.format("[活体实体处理] 原血量: %.2f | 设定伤害: %.2f | 已强制置空血量", currentHp, newDamage));
    }
    // 情况2：无血量实体（掉落物、盔甲架、矿车等）→ 直接销毁
    else {
      t.remove();
      l.info("[非活体实体] 无血量实体，执行移除操作");
    }
  }
}
